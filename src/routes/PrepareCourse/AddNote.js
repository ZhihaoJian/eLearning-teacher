import React from 'react';
import { Row, Col, Card, Button, Upload, Modal, Icon, message } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { editorConfig } from '../../common/editor-config';
import ButtonGroup from 'antd/lib/button/button-group';
import QueryString from '../../utils/query-string';
import { COURSE_RESOURCE_PROPS_CONFIG } from '../../common/upload.config';
import {
    uploadCourseResource,
    onAddTreeNode,
    onLoadTree,
    onLoadChildData,
    onDeleteNode,
    onUpdateNodeName,
    updateCourseNodeContent
} from '../../service/AddExam.service';
import { withRouter } from 'react-router-dom';
import TreeContainer from '../../components/Tree/TreeContainer'

const Dragger = Upload.Dragger;

@withRouter
export default class AddNote extends React.Component {

    state = {
        selectKey: '',
        content: '',
        treeData: [],
        visible: false,
        confirmLoading: false,
        fileList: [],
        disabled: true,
            nodeID: null,
            uploadData: null,
            isVideo: false,
            savePath: ''
        };
    }

    componentDidMount() {
        this.fetchRootNode();
    }

    /**
     * 获取第一层root node
     */
    fetchRootNode = () => {
        let that = this;
        onLoadTree().then(response => {
            that.setState({ treeData: response })
        })
    }

    /**
     * 递归查找结点，并更新结点内容
     * @param node 当前节点
     * @param content 更新内容
     */
    updateNodeContent = (node, content) => {
        let _this = this;
        if (node instanceof Array) {
            node.forEach(item => {
                if (item.children) {
                    this.updateNodeContent(item.children, content);
                }
                else if (item.nodeKey === _this.state.selectKey) {
                    item.content = content;
                    return;
                }
            })
        }
        else {
            if (node.children) {
                this.updateNodeContent(node.children, content);
            }
            //处理根节点是文本的情况
            else if (node.nodeKey === this.state.selectKey) {
                node.content = content;
            }
        }
    }

    /**
     * 触发条件：富文本编辑器手动 crtl + s
     * 
     * 查找结点并更新结点内容
     */
    findNodeToBeUpdated = () => {
        const selectKey = this.state.selectKey;
        const data = this.state.treeData;
        const key = selectKey.slice(0, 3);
        const rootNode = data.filter(node => node.nodeKey === key)[0];
        this.updateNodeContent(rootNode, this.state.content);
        const index = this.state.treeData.findIndex(v => v.nodeKey === key);
        data[index] = rootNode;
        this.setState({ treeData: data })
    }

    handleChange = (content) => {
        this.setState({ content });
    }

    /**
     * 根据选中的结点加载不同的结点内容
     * @param selectkey 选中结点的key值
     * @param content 选中结点的内容 
     */
    handleUpdateEditorContent = (selectKey, content, isLeaf, restParam) => {
        let isVideo = false,
            savePath = '';
        if (/\.(mp4|avi|rmvb)/gi.test(restParam.title)) {
            savePath = `/${restParam.savePath}`;
            isVideo = true;
        }
        this.setState({ selectKey, content, disabled: !isLeaf, nodeID: restParam.id, isVideo, savePath }, () => {
            if (content) {
        this.editorInstance.setContent(content);
    }
        })
    }

    /**
     * 保存富文本的内容
     */
    handleSave = () => {
        const { content, nodeID } = this.state;
        this.findNodeToBeUpdated();
        updateCourseNodeContent({ content, id: nodeID }).then(response => {
            message.success('内容已保存到云端');
        })
    }

    /**
     * 课程资源上传
     */
    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file)
        });
        this.setState({ confirmLoading: true }, () => {
            uploadCourseResource(formData).then(res => this.setState({ confirmLoading: false }))
        })

    }

    /**
     * 根据 FolerTree组件的操作(CRUD)结果，更新树节点数据
     * @param {Array} newTreeData FolderTree操作后的最新TreeData
     * @param {String} type 可选参数，当指定的时候表示与服务器进行同步操作
     * @param {Object} info 可选参数，当指定的时候作为请求参数，需要与 type 联动
     */
    renderUpdatedTree = (newTreeData, type, info) => {
        if (type === 'ADD' || type === 'ADD_FOLDER') {
            info.courseId = QueryString.parse(this.props.location.search).key;
            onAddTreeNode(info).then(data => {
                Object.assign(info.node, data, { isLeaf: data.leaf });
                this.setState({ treeData: newTreeData });
                message.success('已同步到云端');
            })
        } else if (type === 'DEL') {
            onDeleteNode(info.nodeKey).then(response => {
                this.setState({ treeData: newTreeData });
                message.success('已同步到云端');
            })
        }
        this.setState({ treeData: newTreeData });
        this.editorInstance.setContent('');
    }

    /**
     * 渲染breadCrumbList
     */
    renderBreadCrumbList = () => {
        const courseName = QueryString.parse(this.props.location.search).name;
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
        const courseId = QueryString.parse(this.props.location.search).key;
        onAddTreeNode({ ...node, courseId, nodeKey: node.key })
            .then(response => {
                if (response.rootNode) {
                    const targetNode = gData.filter(v => v.key === node.key)[0];
                    Object.assign(targetNode, response);
                    this.renderUpdatedTree(gData);
                }
            })
    }

    /**
     * 向远程服务器加载子节点
     * @param {Object} treeNode 待加载子节点的父节点
     */
    fetchChildNode = treeNode => {
        const dataRef = treeNode.props.dataRef;
        return onLoadChildData(dataRef.nodeKey).then(response => {
            dataRef.children = response.length ? response.map(v => ({ ...v, isLeaf: v.leaf })) : [{ nodeKey: `${dataRef.nodeKey}-0`, isLeaf: true }];
            this.setState({ treeData: [...this.state.treeData] })
        })
    }

    /**
     * 更新结点名称
     * @param {Object} data 更新节点信息，同步到远程服务器
     */
    updateNodeName = (data) => {
        onUpdateNodeName(data).then(response => {
            message.success('已同步到云端');
        })
    }

    render() {
        const title = QueryString.parse(this.props.location.search).type === 'edit' ? '编辑备课' : '新建备课';
        const editorProps = editorConfig(this.handleChange, this.handleSave);
        const action = (
            <React.Fragment>
                <ButtonGroup>
                    <Button>保存</Button>
                    <Button type="primary" >发布</Button>
                </ButtonGroup>
            </React.Fragment>
        )

        return (
            <PageHeaderLayout title={title} breadcrumbList={this.renderBreadCrumbList()} action={action} >
                <Row gutter={24} >
                    <Col span={5} >
                        <Card
                            title='课程资源'
                            bordered={false}
                            hoverable
                        >
                            <TreeContainer
                                loadData={this.fetchChildNode}
                                onUpdateNodeName={data => this.updateNodeName(data)}
                                onAddNodeToServer={(node, gData) => this.onAddNodeToServer(node, gData)}
                                onUpload={() => this.setState({ visible: true })}
                                updateTree={(treeData, type, info) => this.renderUpdatedTree(treeData, type, info)}
                                dataSource={this.state.treeData}
                                onSelected={(selectKey, content, isLeaf, restParam) => this.handleUpdateEditorContent(selectKey, content, isLeaf, restParam)}
                            />

                        </Card>
                    </Col>
                    <Col span={17} >
                        {
                            this.state.isVideo ? (
                                <Player
                                    playsInline
                                    position="center"
                                    src={this.state.savePath}
                                />
                            ) : (
                        <Card>
                            <BraftEditor
                                ref={instance => this.editorInstance = instance}
                                disabled={this.state.disabled}
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
                    <Dragger {...COURSE_RESOURCE_PROPS_CONFIG(this)} disabled={this.state.confirmLoading} >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>
                </Modal>

            </PageHeaderLayout>
        )
    }
}