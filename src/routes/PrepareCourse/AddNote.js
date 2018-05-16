import React from 'react';
import FolderTree from '../../components/Tree/Tree';
import { Row, Col, Card, Button, Upload, Modal, Icon, message } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { editorConfig } from '../../common/editor-config';
import ButtonGroup from 'antd/lib/button/button-group';
import { treeData } from '../../mock/data';
import { COURSE_RESOURCE_PROPS_CONFIG } from '../../common/upload.config';
import Axios from 'axios';
import { onAddText, onAddFolder, onSave, onLoadHistoryNoteInfo } from '../../redux/AddNote.redux';
import { withRouter } from 'react-router-dom';
import QueryString from '../../utils/query-string';
import { connect } from 'react-redux';

const Dragger = Upload.Dragger;

@withRouter
@connect(
    state => state.addNoteReducers,
    { onAddText, onAddFolder, onSave, onLoadHistoryNoteInfo }
)
export default class AddNote extends React.Component {

    state = {
        selectKey: '',
        content: '',
        treeData,
        visible: false,
        confirmLoading: false,
        fileList: []
    }

    componentDidMount() {
        const { id } = QueryString.parse(this.props.location.search);
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
                else if (item.key === _this.state.selectKey) {
                    item.content = content;
                    return;
                }
            })
        }
        else {
            if (node.children) {
                this.updateNodeContent(node.children, content);
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
        const rootNode = data.filter(node => node.key === key)[0];
        this.updateNodeContent(rootNode, this.state.content);
        const index = this.state.treeData.findIndex(v => v.key === key);
        data[index] = rootNode;
        this.setState({ treeData: data })
    }

    handleChange = (content) => {
        this.setState({ content })
    }

    /**
     * 根据选中的结点加载不同的结点内容
     * @param selectkey 选中结点的key值
     * @param content 选中结点的内容 
     */
    handleUpdateEditorContent = (selectKey, content) => {
        this.setState({ selectKey, content })
        this.editorInstance.setContent(content);
    }

    /**
     * 保存富文本的内容
     */
    handleSave = () => {
        this.findNodeToBeUpdated();
    }

    /**
     * 课程资源上传
     */
    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file)
        });
        this.setState({ confirmLoading: true });
        Axios.post('//jsonplaceholder.typicode.com/posts/', formData)
            .then(res => {
                message.success(`${fileList[0]} 文件上传成功!`)
                this.setState({ confirmLoading: false })
            }).catch(err => {
                message.error(`${fileList[0]} 文件上传失败!`)
                this.setState({ confirmLoading: false })
            })
    }

    /**
     * 根据 FolerTree组件的操作(CRUD)结果，更新树节点数据
     * @param newTreeData FolderTree操作后的最新TreeData
     */
    renderUpdatedTree = (newTreeData) => {
        this.setState({ treeData: newTreeData });
        this.editorInstance.setContent('');
    }

    render() {
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
            <PageHeaderLayout title='新建备课' breadcrumbList={this.props.breadcrumbList} action={action} >
                <Row gutter={24} >
                    <Col span={5} >
                        <Card
                            title='课程资源'
                            bordered={false}
                            hoverable
                        >
                            <FolderTree
                                onUpload={() => this.setState({ visible: true })}
                                updateTree={treeData => this.renderUpdatedTree(treeData)}
                                dataSource={this.state.treeData}
                                onSelected={(selectKey, content) => this.handleUpdateEditorContent(selectKey, content)}
                            />
                        </Card>
                    </Col>
                    <Col span={17} >
                        <Card>
                            <BraftEditor
                                ref={instance => this.editorInstance = instance}
                                {...editorProps}
                            />
                        </Card>
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