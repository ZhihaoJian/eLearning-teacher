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
            fileName: ''
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
        this.setState({ selectedKeys })
        const content = info.node.props.content;
        const isLeaf = !!info.node.isLeaf();
        this.props.onSelected(selectedKeys[0], content, isLeaf, { id: info.node.props.id });
    }

    /**
     * 更换文件名
     */
    onComfirmUpdate = () => {
        let { node, fileName, gData } = this.state;
        node.title = fileName;
        this.setState({ gData });
        this.props.onUpdateNodeName({ id: node.id, name: fileName });
    }

    /**
     *  上传文件资源
     */
    onUploadResource = () => {
        this.props.onUpload();
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
        const node = info.node;
        //生成tooltip
        let menu = this.generateMenuTooltip(node);
        const currentNodePosition = node.props.pos;
        const eventKey = node.props.eventKey;
        //保存点击结点位置和点击位置
        this.setState({ selectedKeys: [eventKey], currentNodePosition });
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
    updateTree = (nodeList, type, parentNode) => {
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            if (node.nodeKey !== this.state.selectedKeys[0]) {
                if (node.children) {
                    return this.updateTree(node.children, type, node)
                }
            } else {
                if (type === ADD) {
                    const children = node.children;
                    const newLength = Number.parseInt(children[children.length - 1].nodeKey.slice(-1), 10) + 1;
                    const key = `${node.nodeKey}-${newLength}`
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
                    this.setState({ node })
                } else if (type === ADD_FOLDER) {
                    const folder = {
                        key: `${node.nodeKey}-${node.children.length}`,
                        title: '新建文件夹',
                        isLeaf: false,
                        children: [{
                            key: `${node.nodeKey}-${node.children.length}-0`,
                            isLeaf: true
                        }]
                    };
                    node.children.push(folder);
                    return {
                        nodeKey: `${node.nodeKey}-${node.children.length}`,
                        parentKey: node.nodeKey,
                        node: folder,
                        title: '新建文件夹',
                        isLeaf: false,
                    }
                } else if (type === DEL) {
                    const { gData } = this.state;
                    const index = gData.findIndex(v => v.key === node.nodeKey);
                    //处理删除根节点问题和删除非根结点问题
                    if (!parentNode) {
                        gData.splice(index, 1);
                    } else {
                        parentNode.children.splice(index, 1);
                    }
                    return {
                        nodeKey: node.id,
                    }
                }
            }
        }
    }

    /**
     * 点击context menu
     */
    onContextMenuClick = (e) => {
        const { selectedKeys } = this.state;
        const target = e.target;
        const node = target.nodeName === 'SPAN' ? target.parentElement : target;
        const type = node.className;

        //根据nodePost前三位获取入口结点
        //再根据nodePost剩余的位数判断索引位置
        const rootKey = selectedKeys[0].slice(0, 3);
        // const data = this.state.gData;
        const data = this.props.dataSource;
        const rootNode = data.filter(v => v.nodeKey === rootKey);

        const info = this.updateTree(rootNode, type);
        this.setState({ gData: data })
        this.props.updateTree(data, type, info);
    }

    /**
     * 拖放事件
     */
    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.gData];
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
        }
        this.setState({
            gData: data,
        });
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
                    <div className='context-menu' onClick={this.onContextMenuClick} >{menu}</div>
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
        if (item.children) {
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
        } else {
            return <FaFileText />
        }
    }

    /**
     * 添加根结点（第*周）
     */
    addRootNode = (e) => {
        e.stopPropagation();
        const node = e.target;
        let target = node.nodeName !== 'A' ? node.closest('a') : node;
        const type = target.dataset['type'];
        let { gData } = this.state;

        //处理空树添加结点问题
        let newLength;
        if (!gData.length) {
            newLength = 0;
        } else {
            newLength = Number.parseInt(gData[gData.length - 1].key.slice(-1), 10) + 1;
        }

        const newRootNode = {
            key: `0-${newLength}`,
            isRoot: true
        }

        if (type === ADD_ROOT_FILE) {
            Object.assign(newRootNode, { title: '新建文本' })
            gData.push(newRootNode);
            // gData.push({
            //     key: `0-${newLength}`,
            //     title: '新建文本',
            //     isRoot: true
            // })
        } else if (type === ADD_ROOT_FOLDER) {
            Object.assign(newRootNode, {
                title: '新建文件夹', children: [{
                    key: `0-${newLength}-0`
                }]
            })
            gData.push(newRootNode);
            // gData.push({
            //     key: `0-${newLength}`,
            //     isRoot: true,
            //     title: '新建文件夹',
            //     children: [{
            //         key: `0-${newLength}-0`
            //     }]
            // })
        }
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
                            // icon={this.renderTreeIcon(item)}
                            // isLeaf={!!item.isLeaf}
                            key={item.nodeKey}
                            dataRef={item}
                            {...item}
                        >
                            {loop(item.children)}
                        </TreeNode>);
                }
                return <TreeNode
                    // icon={this.renderTreeIcon(item)}
                    // isLeaf={!!item.isLeaf}
                    key={item.nodeKey}
                    dataRef={item}
                    {...item} />;
            });
        };
        return (
            <NewTree
                loadData={this.props.loadData}
                renderTreeIcon={this.renderTreeIcon}
                addRootNode={this.addRootNode}
                gData={this.state.gData}
                onDrop={this.onDrop}
                onRightClick={this.onRightClick}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                loop={loop}
            />
        );
    }
}