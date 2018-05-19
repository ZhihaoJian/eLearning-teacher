import React from 'react';
import { Upload, Icon, message, Button, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { withRouter } from 'react-router-dom';
import TestResult from './TestResult';
import { detectCode } from '../../service/SimilarCode.service';
const Dragger = Upload.Dragger;
const Option = Select.Option;

@withRouter
export default class SimilarCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            uploading: false,
            data: [],
            detectLevel: { key: 'l' }
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        formData.append('level', this.state.detectLevel.key);

        this.setState({
            uploading: true,
        });

        detectCode(formData).then(data => {
            this.setState({ uploading: false, data })
        })
    }

    /**
     * 初级查重和高级查重切换
     */
    handleChange = (selectedValue) => {
        this.setState({ detectLevel: selectedValue })
    }

    render() {
        const uploadProps = {
            name: 'files',
            multiple: true,
            action: '/upload',
            fileList: this.state.fileList,
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            onChange(info) {
                const status = info.file.status;
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
        };

        return (
            <PageHeaderLayout
                title='代码相似度检测'
                breadcrumbList={this.props.breadcrumbList}
                action={(
                    <React.Fragment>
                        <Select labelInValue defaultValue={this.state.detectLevel} onChange={this.handleChange}>
                            <Option value="l">初级查重</Option>
                            <Option value="h">高级查重</Option>
                        </Select>
                        <Button
                            style={{ marginTop: 10 }}
                            type="primary"
                            onClick={() => this.handleUpload()}
                            disabled={this.state.fileList.length <= 1}
                            loading={this.state.uploading}
                        >
                            {this.state.uploading ? '正在检测' : '开始检测'}
                        </Button>
                    </React.Fragment>
                )}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖动文件到这个区域上传</p>
                    <p className="ant-upload-hint">支持单个或批量上传</p>
                    <p className="ant-upload-hint">目前只支持 C、Python、Java文件检测</p>
                </Dragger>


                {
                    this.state.data.length ? <TestResult dataSource={this.state.data} /> : null
                }
            </PageHeaderLayout>
        )
    }
}