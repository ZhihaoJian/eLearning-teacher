import React from 'react';
import { Row, Col, Card, Button, Upload, Modal, Icon, message } from 'antd';
import BraftEditor from 'braft-editor'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { editorConfig } from '../../common/editor-config';
import ButtonGroup from 'antd/lib/button/button-group';
import QueryString from '../../utils/query-string';
import { COURSE_RESOURCE_PROPS_CONFIG } from '../../common/upload.config';
import { announceCourse } from '../../service/AddExam.service';
import { Player } from 'video-react';
import { withRouter } from 'react-router-dom';
import {
    deleteNode,
    loadTreeRoot,
    onLoadChildData,
    updateNodeName,
    addTreeNode,
    updateTree,
    updateEditorContent,
    updateStates,
    saveEditorContent,
    updateCourseVideo,
    loadFileContent,
    reset,
    syncDragNodes
} from '../../redux/FolderTree.redux';
import { connect } from 'react-redux';
import TreeContainer from '../../components/Tree/TreeContainer_V2'

import './AddNote.scss';
import 'braft-editor/dist/braft.css';

const Dragger = Upload.Dragger;

@withRouter
@connect(
    props => props.folderTreeReducers,
    {
        saveEditorContent,
        loadTreeRoot,
        onLoadChildData,
        updateNodeName,
        addTreeNode,
        updateTree,
        deleteNode,
        updateEditorContent,
        updateStates,
        updateCourseVideo,
        loadFileContent,
        reset,
        syncDragNodes
    }
)
export default class AddNote extends React.Component {

    state = {
        courseId: QueryString.parse(this.props.location.search).key,
        fileList: [],
        confirmLoading: false,
    }

    componentDidMount() {
        this.fetchRootNode();
    }

    componentWillUnmount() {
        this.props.reset();
    }

    /**
     * 获取第一层root node
     */
    fetchRootNode = () => {
        const courseId = this.state.courseId;
        this.props.loadTreeRoot(courseId)
    }

    /**
     * 递归查找结点，并更新结点内容
     * @param node 当前节点
     * @param content 更新内容
     */
    updateNodeContent = (nodeList, parentNode, content) => {
        for (let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            if (node.nodeKey !== this.props.selectKey) {
                if (node.children) {
                    return this.updateNodeContent(node.children, node, content)
                }
            } else {
                node.content = content;
                return {
                    node,
                    parentNode
                };
            }
        }
    }

    /**
     * 触发条件：富文本编辑器手动 crtl + s
     * 
     * 查找结点并更新结点内容
     */
    findNodeToBeUpdated = () => {
        const selectKey = this.props.selectKey;
        const data = this.props.treeData;
        const rootKey = selectKey.split('-').slice(0, 2).join('-');
        const rootNode = data.filter(node => node.nodeKey === rootKey);
        const cachedNode = this.updateNodeContent(rootNode, undefined, this.props.content);
        this.props.updateTree(data);
        return cachedNode;
    }

    handleChange = (content) => {
        this.props.updateEditorContent(content);
    }

    /**
     * 根据选中的结点加载不同的结点内容
     * @param selectkey 选中结点的key值
     * @param content 选中结点的内容 
     */
    handleUpdateEditorContent = ({ selectKey, content, isLeaf, restParam }) => {
        let isVideo = false,
            savePath = '';
        if (/\.(mp4|avi|rmvb)$/.test(restParam.savePath)) {
            savePath = `/${restParam.savePath}`;
            isVideo = true;
        } else if (/\.txt$/.test(restParam.savePath)) {
            this.props
                .loadFileContent(restParam.id)
                .then(content => this.editorInstance.setContent(content))
        } else {
            this.editorInstance && this.editorInstance.setContent(content);
        }
        this.props.updateStates({
            selectKey,
            disabled: !isLeaf,
            isVideo,
            savePath
        })
    }

    /**
     * 保存富文本的内容
     */
    handleSave = () => {
        const cachedNode = this.findNodeToBeUpdated();
        this.handleSyncContent(cachedNode);
    }

    /**
     * 同步内容到云端
     */
    handleSyncContent = ({ node, parentNode }) => {
        const { content } = this.props;
        this.props.saveEditorContent({ content, id: node.id })
            .then(res => {
                Object.assign(node, { savePath: res.savePath, id: res.id });
            })
    }

    /**
     * 课程资源上传
     */
    handleUpload = () => {
        const { uploadData } = this.props;
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file)
        });
        Object.keys(uploadData).forEach(key => {
            formData.append([key], uploadData[key]);
        })
        this.setState({ confirmLoading: true })
        this.props.updateCourseVideo(formData)
            .then(() => {
                this.setState({ confirmLoading: false, visible: false })
                const dataRef = uploadData.dataRef;
                // const dataRef = node ? node : node.dataRef;
                this.props.onLoadChildData({
                    node: dataRef,
                    courseId: this.state.courseId,
                    parentKey: dataRef.nodeKey
                });
            })

    }

    /**
     * 根据 FolerTree组件的操作(CRUD)结果，更新树节点数据
     * @param {Array} newTreeData FolderTree操作后的最新TreeData
     * @param {String} type 可选参数，当指定的时候表示与服务器进行同步操作
     * @param {Object} info 可选参数，当指定的时候作为请求参数，需要与 type 联动
     */
    renderUpdatedTree = (newTreeData, type, info) => {
        if (type && (type === 'ADD' || type === 'ADD_FOLDER')) {
            this.props.addTreeNode({ ...info, courseId: this.state.courseId }, (data) => {
                const node = info.node ? info.node : info;
                Object.assign(node, data, { isLeaf: data.leaf });
                this.props.onLoadChildData({
                    node: info.node,
                    courseId: this.state.courseId,
                    parentKey: info.node.parentKey
                });
                message.success('已同步到云');
            })
        } else if (type && type === 'DEL') {
            const { node } = info;
            this.props.deleteNode(node.id)
                .then(() => {
                    node.rootNode ?
                        this.props.loadTreeRoot(node.courseId) :
                        this.props.onLoadChildData({
                            node,
                            courseId: this.state.courseId,
                            parentKey: node.parentKey
                        });
                })
        }
        this.props.updateTree(newTreeData, () => {
            this.editorInstance && this.editorInstance.setContent('')
        })
    }

    /**
     * 渲染breadCrumbList
     */
    renderBreadCrumbList = () => {
        const courseName = QueryString.parse(this.props.location.search).name || '';
        const breadObj = this.props.breadcrumbList.find(v => v.title === courseName);
        if (!breadObj) {
            this.props.breadcrumbList.push({ title: courseName })
        }
        return this.props.breadcrumbList;
    }


    /**
     * 向服务器发起新增节点,成功后重新渲染tree
     */
    onAddNodeToServer = (node, gData) => {
        const { courseId } = this.state;
        this.props.addTreeNode({ ...node, courseId, nodeKey: node.key }, (data) => {
            if (data.rootNode) {
                const targetNode = gData.filter(v => v.key === node.key)[0];
                Object.assign(targetNode, data, { isLeaf: data.leaf });
                this.renderUpdatedTree(gData);
            }
        })
    }

    /**
     * 向远程服务器加载子节点
     * @param {Object} treeNode 待加载子节点的父节点
     */
    fetchChildNode = treeNode => {
        let dataRef = treeNode.props.dataRef;
        const { courseId } = this.state;
        return this.props.onLoadChildData({
            node: dataRef,
            courseId,
            parentKey: dataRef.nodeKey
        });
    }

    /**
     * 更新结点名称
     * @param {Object} data 更新节点信息，同步到远程服务器
     */
    updateNodeName = (info) => {
        const { dataRef, fileName } = { ...info };
        this.props.updateNodeName({ id: dataRef.id, title: fileName })
            .then(() => {
                const { dataRef, parentNode } = { ...info },
                    parentKey = dataRef.rootNode ? dataRef.nodeKey : dataRef.parentKey,
                    courseId = this.state.courseId;
                dataRef.rootNode ? this.props.loadTreeRoot(courseId) : this.props.onLoadChildData({
                    node: parentNode,
                    courseId,
                    parentKey
                })
            })
    }

    onUpload = (uploadData) => {
        this.setState({ visible: true }, () => {
            this.props.updateStates({ uploadData })
        });
    }

    /**
     * 发布备课
     */
    onAnnounceCourse = () => {
        announceCourse(this.state.courseId);
    }

    /**
     * 同步拖拽结点
     */
    syncDragNodes = (dragedNodes) => {
        const { dataRef, courseNode } = dragedNodes;
        this.props
            .onLoadChildData({
                node: dataRef,
                parentKey: dataRef.parentKey,
                courseId: this.state.courseId
            })
            .then(() => {
                console.log(this.props.treeData);
                this.props.syncDragNodes(courseNode);
            })
    }


    render() {
        const title = QueryString.parse(this.props.location.search).type === 'edit' ? '编辑备课' : '新建备课';
        const editorProps = editorConfig(this.handleChange, this.handleSave);
        const action = (
            <React.Fragment>
                <ButtonGroup>
                    <Button onClick={() => this.handleSyncContent()}>保存</Button>
                    <Button type="primary" onClick={this.onAnnounceCourse} >发布</Button>
                </ButtonGroup>
            </React.Fragment>
        );

        return (
            <PageHeaderLayout
                title={title}
                breadcrumbList={this.renderBreadCrumbList()}
                action={action}
            >
                <Row gutter={24} >
                    <Col span={5} >
                        <Card
                            title='课程资源'
                            bordered={false}
                            hoverable
                        >
                            <TreeContainer
                                loadData={this.fetchChildNode}
                                syncDragNodes={dragedNodes => this.syncDragNodes(dragedNodes)}
                                onUpdateNodeName={info => this.updateNodeName(info)}
                                onAddNodeToServer={(node, gData) => this.onAddNodeToServer(node, gData)}
                                onUpload={(uploadData) => this.onUpload(uploadData)}
                                updateTree={(treeData, type, info) => this.renderUpdatedTree(treeData, type, info)}
                                dataSource={this.props.treeData}
                                onSelected={selectedInfo => this.handleUpdateEditorContent({ ...selectedInfo })}
                            />

                        </Card>
                    </Col>
                    <Col span={17} >
                        {
                            this.props.isVideo ? (
                                <Player
                                    playsInline
                                    position="center"
                                    src={this.props.savePath}
                                />
                            ) : (
                                    <Card>
                                        <BraftEditor
                                            ref={instance => this.editorInstance = instance}
                                            disabled={this.props.disabled}
                                            {...editorProps}
                                        />
                                    </Card>
                                )
                        }
                    </Col>
                </Row>

                <Modal
                    visible={this.state.visible}
                    title='上传课程资源'
                    maskClosable={false}
                    onCancel={() => this.setState({ visible: false })}
                    confirmLoading={this.state.confirmLoading}
                    onOk={() => this.handleUpload()}
                >
                    <Dragger {...COURSE_RESOURCE_PROPS_CONFIG(this, 'video')} disabled={this.state.confirmLoading} >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>
                </Modal>

            </PageHeaderLayout >
        )
    }
}