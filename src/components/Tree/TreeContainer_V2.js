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
            typeArr: [UPDATE, ADD, DEL, ADD_FOLDER, ADD_ROOT_FILE, ADD_ROOT_FOLDER, ADD_VIDEO_RESOURCE],
            nodeKey: '',
            dataRef: null,
            type: '',
            fileName: ''
        }
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
            this.props.onSelected({
                selectKey: selectedKeys[0],
                content,
                isLeaf,
                restParam: { ...info.node.props.dataRef }
            });
        })
    }

    /**
     * 更换文件名
     */
    onComfirmUpdate = () => {
        let { dataRef, fileName, parentNode } = this.state;
        console.log(parentNode);
        this.props.onUpdateNodeName({ dataRef, fileName, parentNode });
    }

    /**
     * 找节点的最大下标
     */
    findMaxLength = (dataSource) => {
        return dataSource.length ? (Math.max(...dataSource.map((v) => {
            const nodeKey = v.nodeKey,
                lastIndex = nodeKey.lastIndexOf('-'),
                start = Number.parseInt(nodeKey.slice(lastIndex + 1), 10);
            return start;
        }, this)) + 1) : 0;
    }

    /**
     *  上传文件资源
     */
    onUploadResource = () => {
        const dataRef = this.state.dataRef,
            newLength = this.findMaxLength(dataRef.children),
            newNodeKey = `${dataRef.nodeKey}-${newLength}`;
        this.props.onUpload({
            courseId: dataRef.courseId,
            parentKey: dataRef.nodeKey,
            dataRef,
            leaf: true,
            nodeKey: newNodeKey
        });
    }

    /**
     * 根据不同结点生成不同的context menu
     * @param 当前结点
     */
    generateMenuTooltip = (dataRef) => {
        let menu,
            fileName = dataRef.title;
        menu = (
            <React.Fragment>
                {
                    dataRef.isLeaf ? null : (
                        <React.Fragment>
                            <div className={ADD} ><span>新建文件</span></div>
                            <div className={ADD_FOLDER} ><span>新建文件夹</span></div>
                            <div className={ADD_VIDEO_RESOURCE} onClick={() => this.onUploadResource()} ><span>上传视频资源</span></div>
                        </React.Fragment>
                    )
                }
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
        return menu;
    }

    /**
     * 鼠标右击
     */
    onRightClick = (info) => {
        const dataRef = info.node.props.dataRef;
        const nodeKey = dataRef.nodeKey;
        const parentNode = this.findParentNode(nodeKey)
        let menu = this.generateMenuTooltip(dataRef);
        this.setState({ nodeKey, dataRef, parentNode });
        this.renderCm(info, menu);
    }

    /**
     * 找父节点
     * @param {Array} nodeList
     * @param {Object} parentNode
     * @param {String} selectedKey
     */
    findParentNode = (nodeKey, parentNode) => {
        const keys = nodeKey.split('-');
        let dataSource = this.props.dataSource;
        let pathKeys = [];
        //拆分Key  --->  ['0','0-1','0-1-5','0-1-5-5']
        for (let i = 0; i < keys.length; i++) {
            pathKeys.push(keys.slice(0, i + 1).join('-'));
        }
        //因为最后一个元素为右键点击选中的结点
        //所以它的前一个元素必定为它的父节点
        for (let index = 1; index < pathKeys.length - 1; index++) {
            parentNode = dataSource.filter(v => v.nodeKey === pathKeys[index])[0];
            dataSource = parentNode.children;
        }
        return parentNode;
    }

    /**
     * 寻找第一层入口对象
     * @param {String} selectedKey 选中的节点key值
     */
    findEntryObject = (selectedKey) => {
        const rootKey = selectedKey.split('-').slice(0, 2).join('-');
        return this.props.dataSource.filter(v => v.nodeKey === rootKey);
    }

    /**
     * 根据点击context menu不同选项，更新treeData相应节点信息
     * 
     * @argument nodeList        当前结点列表
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
                if (type === ADD || type === ADD_FOLDER) {
                    //找nodeKey的最大值，并设置新的最大值给新建文件夹                    
                    const children = node.children;
                    const maxlength = Math.max(
                        ...node.children
                            .map(v => v.nodeKey)
                            .map(v => v.slice(node.nodeKey.length + 1))
                            .map(v => Number.parseInt(v, 10))) + 1;
                    const key = `${node.nodeKey}-${maxlength}`
                    const file = { key, content: '' };
                    const folder = {
                        key,
                        title: '新建文件夹',
                        isLeaf: false,
                        children: [{
                            key: `${key}-0`,
                            isLeaf: true
                        }]
                    };
                    type === ADD ? children.push(file) : children.push(folder);
                    return {
                        nodeKey: key,
                        node: type === ADD ? file : folder,
                        parentKey: node.nodeKey,
                        content: '',
                        isLeaf: type === ADD ? true : false,
                        title: type === ADD ? '新建文本' : '新建文件夹'
                    }
                } else if (type === UPDATE) {
                    // this.setState({ dataRef: node });
                    return {
                        nodeKey: node.nodeKey,
                        id: node.id,
                        title: node.title
                    }
                } else if (type === DEL) {
                    const gData = nodeList;
                    const index = gData.findIndex(v => v.nodeKey === node.nodeKey);
                    //处理删除根节点问题和删除非根结点问题
                    parentNode ? parentNode.children.splice(index, 1) : gData.splice(index, 1)
                    return { node }
                }
            }
        }
    }

    /**
     * 点击context menu
     */
    onContextMenuClick = (e) => {
        e.stopPropagation();
        const { nodeKey, typeArr } = this.state;
        const dataSource = this.props.dataSource;
        const target = e.target;
        const node = target.nodeName === 'SPAN' ? target.parentElement : target;
        const type = node.className;

        if (typeArr.indexOf(type) !== -1) {
            //确定入口对象的nodeKey
            const rootNode = this.findEntryObject(nodeKey);
            const selectedInfo = this.updateTree(rootNode, type, undefined, nodeKey);
            this.props.updateTree(dataSource, type, selectedInfo);
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
        let newLength = 0;
        const target = e.currentTarget,
            type = target.dataset['type'],
            dataSource = this.props.dataSource,
            newRootNode = {
                rootNode: true
            }

        newLength = this.findMaxLength(dataSource);

        newRootNode.key = `0-${newLength}`;

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

        dataSource.push(newRootNode);
        this.props.onAddNodeToServer(newRootNode, dataSource);
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