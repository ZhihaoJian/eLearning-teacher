import React from 'react';
import ReactDOM from 'react-dom';
import { Popconfirm, Input } from 'antd';
import FaFileText from 'react-icons/lib/fa/file-text-o';
import FaFolder from 'react-icons/lib/fa/folder-o';
import FaFileCode from 'react-icons/lib/fa/file-code-o';
import FaInfo from 'react-icons/lib/fa/info-circle';
import FaImage from 'react-icons/lib/fa/image';
import FaHtml5 from 'react-icons/lib/fa/html5';
import FaCSS3 from 'react-icons/lib/fa/css3';
import FaVideoCamera from 'react-icons/lib/fa/video-camera';
import { Tree, Tooltip } from 'antd';
import NewTree from './NewTree';
import './index.scss';

const TreeNode = Tree.TreeNode;
const UPDATE = 'UPDATE';
const ADD = 'ADD';
const DEL = 'DEL';
const ADD_FOLDER = 'ADD_FOLDER';
const ADD_ROOT_FILE = 'ADD_ROOT_FILE';
const ADD_ROOT_FOLDER = 'ADD_ROOT_FOLDER';
const ADD_VIDEO_RESOURCE = 'ADD_VIDEO_RESOURCE';

export default class TreeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            gData: [],
            selectedKeys: [],
            currentNodePosition: '',
            node: null,
            fileName: '',
            typeArr: [UPDATE, ADD, DEL, ADD_FOLDER, ADD_ROOT_FILE, ADD_ROOT_FOLDER, ADD_VIDEO_RESOURCE],
            type: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ gData: nextProps.dataSource })
    }

    /**
     * 选中结点触发
     * @param selectedKeys 选中结点key值
     * @param info  选中结点的信息
     */
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys }, () => {
            const content = info.node.props.content;
            const isLeaf = !!info.node.isLeaf();
            this.props.onSelected(selectedKeys[0], content, isLeaf, { ...info.node.props.dataRef });
        })
    }

    /**
     * 更换文件名
     */
    onComfirmUpdate = () => {
        let { node, fileName, gData } = this.state;
        node.dataRef ? node.dataRef.title = fileName : node.title = fileName;
        // node.title = fileName;
        this.props.onUpdateNodeName(gData, { node, fileName });
    }

    /**
     *  上传文件资源
     */
    onUploadResource = () => {
        const { node } = this.state;
        const newDataRef = node.props ? node.props.dataRef : node.dataRef;
        const children = newDataRef.children;
        let index = children.length ? children.length : 1;
        const newNodeKey = `${newDataRef.nodeKey}-${Number.parseInt(children[index - 1].nodeKey.slice(-1), 10) + 1}`
        this.props.onUpload({
            courseId: newDataRef.courseId,
            nodeKey: newNodeKey,
            node,
            parentKey: newDataRef.nodeKey,
            leaf: true
        });
    }

    /**
     * 根据不同结点生成不同的context menu
     * @param 当前结点
     */
    generateMenuTooltip = (node) => {
        let menu;
        let fileName = node.props.title;
        this.setState({ fileName })
        if (node.isLeaf()) {
            menu = (
                <React.Fragment>
                    <Popconfirm
                        placement='right'
                        title={<Input defaultValue={fileName} onChange={(e) => this.setState({ fileName: e.target.value })} />}
                        onConfirm={this.onComfirmUpdate}
                        okText='确定'
                        cancelText='取消 '
                    >
                        <div className={UPDATE} ><span>修改名称</span></div>
                    </Popconfirm>
                    <div className={DEL} ><span>删除</span></div>
                </React.Fragment>
            )
        } else {
            menu = (
                <React.Fragment>
                    <div className={ADD} ><span>新建文件</span></div>
                    <div className={ADD_FOLDER} ><span>新建文件夹</span></div>
                    <div className={ADD_VIDEO_RESOURCE} onClick={() => this.onUploadResource()} ><span>上传视频资源</span></div>
                    <Popconfirm
                        placement='right'
                        title={<Input defaultValue={fileName} onChange={(e) => this.setState({ fileName: e.target.value })} />}
                        onConfirm={this.onComfirmUpdate}
                        okText='确定'
                        cancelText='取消 '
                    >
                        <div className={UPDATE} ><span>修改名称</span></div>
                    </Popconfirm>
                    <div className={DEL} ><span>删除</span></div>
                </React.Fragment>
            )
        }
        return menu;
    }

    /**
     * 鼠标右击
     */
    onRightClick = (info) => {
        const nodeDataRef = info.node.props;
        const treeNode = info.node;
        //生成tooltip

        let menu = this.generateMenuTooltip(treeNode);
        const currentNodePosition = nodeDataRef.pos;
        const eventKey = nodeDataRef.eventKey;
        //保存点击结点位置和点击位置
        this.setState({ selectedKeys: [eventKey], currentNodePosition, node: nodeDataRef });
        //渲染context menu
        this.renderCm(info, menu);
    }

    /**
     * 根据点击context menu不同选项，更新treeData相应节点信息
     * 
     * @argument nodeList       当前结点列表
     * @argument type           操作类型 内定有 ADD|UPDATE|ADD_FOLDER|DEL
     * @argument parentNode     父节点
     */
    updateTree = (nodeList, type, parentNode, selectedKeys) => {
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            if (node.nodeKey !== selectedKeys) {
                if (node.children) {
                    return this.updateTree(node.children, type, node, selectedKeys)
                }
            } else {
                if (type === ADD) {
                    const children = node.children;
                    //找nodeKey的最大值，并设置新的最大值给新建文件夹                    
                    const maxlength = Math.max(...node.children.map(v => v.nodeKey).map(v => v.slice(node.nodeKey.length + 1)).map(v => Number.parseInt(v, 10))) + 1;
                    const key = `${node.nodeKey}-${maxlength}`
                    const file = { key, content: '' };
                    children.push(file);
                    return {
                        nodeKey: key,
                        node: file,
                        parentKey: node.nodeKey,
                        content: '',
                        isLeaf: true,
                        title: '新建文本'
                    }
                } else if (type === UPDATE) {
                    this.setState({ node });
                    return {
                        nodeKey: node.nodeKey,
                        id: node.id,
                        title: node.title
                    }
                } else if (type === ADD_FOLDER) {
                    //找nodeKey的最大值，并设置新的最大值给新建文件夹
                    const maxlength = Math.max(...node.children.map(v => v.nodeKey).map(v => v.slice(node.nodeKey.length + 1)).map(v => Number.parseInt(v, 10))) + 1;
                    const folder = {
                        key: `${node.nodeKey}-${maxlength}`,
                        title: '新建文件夹',
                        isLeaf: false,
                        children: [{
                            key: `${node.nodeKey}-${maxlength}-0`,
                            isLeaf: true
                        }]
                    };
                    node.children.push(folder);
                    return {
                        nodeKey: folder.key,
                        parentKey: node.nodeKey,
                        node: folder,
                        title: '新建文件夹',
                        isLeaf: false,
                    }
                } else if (type === DEL) {
                    const gData = nodeList;
                    const index = gData.findIndex(v => v.nodeKey === node.nodeKey);
                    //处理删除根节点问题和删除非根结点问题
                    if (!parentNode) {
                        gData.splice(index, 1);
                    } else {
                        parentNode.children.splice(index, 1);
                    }
                    return {
                        node
                    }
                }
            }
        }
    }

    /**
     * 点击context menu
     */
    onContextMenuClick = (e) => {
        e.stopPropagation();
        const { selectedKeys, typeArr } = this.state;
        const target = e.target;
        const node = target.nodeName === 'SPAN' ? target.parentElement : target;
        const type = node.className;

        if (typeArr.indexOf(type) !== -1) {
            //确定入口对象的nodeKey
            const rootKey = selectedKeys[0].split('-').slice(0, 2).join('-');
            const data = this.props.dataSource;
            const rootNode = data.filter(v => v.nodeKey === rootKey);

            const info = this.updateTree(rootNode, type, undefined, selectedKeys[0]);
            this.setState({ gData: data }, () => {
                const { gData } = this.state;
                this.props.updateTree(gData, type, info);
            })
        }

    }

    componentDidMount() {
        this.getContainer();
    }

    componentWillUnmount() {
        if (this.cmContainer) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            document.body.removeChild(this.cmContainer);
            this.cmContainer = null;
        }
    }

    getContainer() {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }

    renderCm(info, menu) {
        if (this.menu) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.menu = null;
        }
        this.menu = (
            <Tooltip
                trigger='click'
                defaultVisible
                overlay={(
                    <div className='context-menu' onClick={(e) => this.onContextMenuClick(e)} >{menu}</div>
                )}
            >
            </Tooltip>
        );

        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
            position: 'absolute',
            left: `${info.event.pageX}px`,
            top: `${info.event.pageY}px`,
        });

        ReactDOM.render(this.menu, container);
    }

    /**
     * 初始化树时候，根据不同的结点类型渲染不同文件图标
     * 例如：文件夹返回文件夹图标
     * @param item 结点信息
     */
    renderTreeIcon = (item) => {
        const title = item.title;
        if (!item.isLeaf) {
            return <FaFolder />
        } else if (/\.(js|jsx|java|c|cpp|py)$/.test(title)) {
            return <FaFileCode />
        } else if (/\.html$/.test(title)) {
            return <FaHtml5 />
        } else if (/\.css$/.test(title)) {
            return <FaCSS3 />
        } else if (/\.(md|MD)$/.test(title)) {
            return <FaInfo />
        } else if (/\.(jpg|png|gif|svg)$/.test(title)) {
            return <FaImage />
        } else if (/\.(mp4|avi|rmvb)$/.test(title)) {
            return <FaVideoCamera />
        }
        else {
            return <FaFileText />
        }
    }

    /**
     * 添加根结点（第*周）
     */
    addRootNode = (e) => {
        e.stopPropagation();
        const target = e.currentTarget;
        const type = target.dataset['type'];
        let { gData } = this.state;

        //处理空树添加结点问题
        let newLength;
        if (!gData.length) {
            newLength = 0;
        } else {
            try {
                newLength = Number.parseInt(gData[gData.length - 1].nodeKey.slice(-1), 10) + 1;
            } catch (error) {
                console.log(gData);
                console.log(gData.length);
            }
        }

        const newRootNode = {
            key: `0-${newLength}`,
            rootNode: true
        }

        if (type === ADD_ROOT_FILE) {
            Object.assign(newRootNode, { title: '新建文本', leaf: true })
        } else if (type === ADD_ROOT_FOLDER) {
            Object.assign(newRootNode, {
                title: '新建文件夹',
                children: [{
                    key: `0-${newLength}-0`
                }]
            })
        }
        gData.push(newRootNode);
        this.setState({ gData })
        this.props.updateTree(gData);
        this.props.onAddNodeToServer(newRootNode, gData);
    }

    render() {
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode
                            icon={this.renderTreeIcon(item)}
                            key={item.nodeKey}
                            dataRef={item}
                            {...item}
                        >
                            {loop(item.children)}
                        </TreeNode>);
                }
                return <TreeNode
                    icon={this.renderTreeIcon(item)}
                    key={item.nodeKey}
                    dataRef={item}
                    {...item}
                />;
            });
        };
        return (
            <NewTree
                loadData={this.props.loadData}
                renderTreeIcon={this.renderTreeIcon}
                addRootNode={this.addRootNode}
                gData={this.props.dataSource}
                onRightClick={this.onRightClick}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                loop={loop}
            />
        );
    }
}