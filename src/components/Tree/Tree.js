import React from 'react';
import ReactDOM from 'react-dom';
import { Popconfirm, Input, Collapse } from 'antd';
import './index.scss';
import FaFileText from 'react-icons/lib/fa/file-text-o';
import FaFolder from 'react-icons/lib/fa/folder-o';
import FaFileCode from 'react-icons/lib/fa/file-code-o';
import FaInfo from 'react-icons/lib/fa/info-circle';
import FaImage from 'react-icons/lib/fa/image';
import FaHtml5 from 'react-icons/lib/fa/html5';
import FaCSS3 from 'react-icons/lib/fa/css3';
import FaPlus from 'react-icons/lib/fa/plus';
import { Tree, Tooltip } from 'antd';

const TreeNode = Tree.TreeNode;
const UPDATE = 'UPDATE';
const ADD = 'ADD';
const DEL = 'DEL';
const ADD_FOLDER = 'ADD_FOLDER';
const ADD_ROOT_FILE = 'ADD_ROOT_FILE';
const ADD_ROOT_FOLDER = 'ADD_ROOT_FOLDER';
const ADD_VIDEO_RESOURCE = 'ADD_VIDEO_RESOURCE';

export default class FolderTree extends React.Component {

    state = {
        visible: false,
        gData: this.props.dataSource,
        selectedKeys: [],
        currentNodePosition: '',
        node: null,
        fileName: ''
    }

    /**
     * 选中结点触发
     * @param selectedKeys 选中结点key值
     * @param info  选中结点的信息
     */
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys })
        const content = info.node.props.content;
        this.props.onSelected(selectedKeys[0], content);
    }

    /**
     * 更换文件名
     */
    onComfirmUpdate = () => {
        let { node, fileName, gData } = this.state;
        node.title = fileName;
        this.setState({ gData })
    }

    onUploadResource = () => {
        this.props.onUpload();
    }

    /**
     * 根据不同结点生成不同的context menu
     * @param 当前结点
     */
    generateMenuTooltip = (node) => {
        let menu;
        if (node.isLeaf()) {
            menu = (
                <React.Fragment>
                    <Popconfirm
                        placement='right'
                        title={<Input onChange={(e) => this.setState({ fileName: e.target.value })} />}
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
                        title={<Input onChange={(e) => this.setState({ fileName: e.target.value })} />}
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
        //保存点击结点位置和点击位置
        this.setState({ selectedKeys: [currentNodePosition], currentNodePosition });
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
            if (node.key !== this.state.selectedKeys[0]) {
                if (node.children) {
                    this.updateTree(node.children, type, node)
                }
            } else {
                if (type === ADD) {
                    const children = node.children;
                    const key = `${node.key}-${children.length}`
                    children.push({ key, content: '' });
                } else if (type === UPDATE) {
                    this.setState({ node })
                } else if (type === ADD_FOLDER) {
                    node.children.push({
                        key: `${node.key}-${node.children.length}`,
                        title: '新建文件夹',
                        isLeaf: false,
                        children: [{
                            key: `${node.key}-${node.children.length}-0`,
                            isLeaf: true
                        }]
                    });
                } else if (type === DEL) {
                    const deleteIndex = Number.parseInt(node.key.slice(-1), 10);
                    //处理删除根节点问题和删除非根结点问题
                    if (!parentNode) {
                        this.state.gData.splice(deleteIndex, 1);
                    } else {
                        parentNode.children.splice(deleteIndex, 1);
                    }
                }
            }
        }
    }

    /**
     * 点击context menu
     */
    onContextMenuClick = (e) => {
        const { currentNodePosition } = this.state;
        const target = e.target;
        const node = target.nodeName === 'SPAN' ? target.parentElement : target;
        const type = node.className;

        //根据nodePost前三位获取入口结点
        //再根据nodePost剩余的位数判断索引位置
        const rootKey = currentNodePosition.slice(0, 3);
        const data = this.state.gData;
        const rootNode = data.filter(v => v.key === rootKey);

        this.updateTree(rootNode, type);
        this.setState({ gData: data })
        this.props.updateTree(data);
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
        let { gData } = this.state;
        let target = node.nodeName !== 'A' ? node.closest('a') : node;
        const type = target.dataset['type'];
        if (type === ADD_ROOT_FILE) {
            gData.push({
                key: `0-${gData.length}`,
                title: '新建文本'
            })
        } else if (type === ADD_ROOT_FOLDER) {
            gData.push({
                key: `0-${gData.length}`,
                title: '新建文件夹',
                children: [{
                    key: `0-${gData.length}-0`
                }]
            })
        }
        this.setState({ gData })
    }

    render() {
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (<TreeNode icon={this.renderTreeIcon(item)} key={item.key} title={item.title} isLeaf={item.isLeaf} >
                        {loop(item.children)}
                    </TreeNode>);
                }
                return <TreeNode icon={this.renderTreeIcon(item)} key={item.key} title={item.title} content={item.content} isLeaf={item.isLeaf} />;
            });
        };
        return (
            <div className='tree' >
                <Collapse
                    defaultActiveKey={'1'}
                >
                    <Collapse.Panel
                        key={'1'}
                        header={
                            (
                                <div className='add-node' onClick={this.addRootNode} >
                                    <a data-type={ADD_ROOT_FILE} title='新建文本文件'><FaPlus /></a>
                                    <a data-type={ADD_ROOT_FOLDER} title='新建文件夹'><FaFolder /></a>
                                </div>
                            )
                        }
                    >
                        <Tree
                            draggable
                            showIcon
                            defaultSelectedKeys={this.state.selectedKeys}
                            onSelect={this.onSelect}
                            onRightClick={this.onRightClick}
                            onDrop={this.onDrop}
                        >
                            {loop(this.state.gData)}
                        </Tree>
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}