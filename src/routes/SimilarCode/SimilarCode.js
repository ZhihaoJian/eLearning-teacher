import React from 'react';
import { Upload, Icon, Button, Select, Steps, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { withRouter } from 'react-router-dom';
import TestResult from './TestResult';
import { detectCode, fetchProcessQueryStatus } from '../../service/SimilarCode.service';
import { STATUS_CODES, STATUS_TITLE } from './_variable';
const Step = Steps.Step;
const Option = Select.Option;

@withRouter
export default class SimilarCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            data: null,
            detectLevel: { key: 'l' },
            current: 0,
            status: STATUS_CODES.DEFAULT,
            title: STATUS_TITLE.PENDING_TITLE
        }
    }

    /**
     * 轮询任务队列
     */
    fetchProcessStatus = (url) => {
        return fetchProcessQueryStatus(url).then(res => {
            const title = this.renderProcessStepTitle(res.state);
            if (res.state !== STATUS_CODES.SUCCESS) {
                setTimeout(() => {
                    this.setState({ data: res, title }, () => {
                        this.fetchProcessStatus(url);
                    })
                }, 2500);
            }
            else {
                const { current } = this.state;
                this.setState({
                    data: res,
                    current: current + 1,
                    status: res.result.state,
                    title
                })
            }
        })
    }

    /**
     * 文件上传
     */
    handleUpload = (e) => {
        e.stopPropagation();

        this.setState({ current: 0, status: '', data: null }, () => {
            const { fileList, current } = this.state;
            const formData = new FormData();

            fileList.forEach((file) => {
                formData.append('files[]', file);
            });

            formData.append('level', this.state.detectLevel.key);

            detectCode(formData).then(url => {
                this.fetchProcessStatus(url);
            })

            this.setState({
                current: current + 1,
                status: STATUS_CODES.PENDING
            });
        })

    }

    /**
     * 初级查重和高级查重切换
     */
    handleChange = (selectedValue) => {
        this.setState({ detectLevel: selectedValue })
    }


    /**
     * 渲染step处理图标
     */
    renderProcessStep = () => {
        const { status } = this.state;
        if (status === STATUS_CODES.DEFAULT || status === STATUS_CODES.SUCCESS) {
            return null;
        } else if (status === STATUS_CODES.PENDING) {
            return (<Icon type='loading' />)
        }
    }

    /**
     * 条件渲染step的检测title
     */
    renderProcessStepTitle = (status) => {
        if (status === STATUS_CODES.PENDING || status === STATUS_CODES.DEFAULT) {
            return STATUS_TITLE.PENDING_TITLE;
        } else if (status === STATUS_CODES.PROGRESS || STATUS_CODES.SUCCESS) {
            return STATUS_TITLE.PROGRESS_TITLE;
        } 
        // else if (status === STATUS_CODES.SUCCESS) {
        //     return STATUS_TITLE.SUCCESS_TITLE;
        // }
    }

    render() {
        //队列百分比
        const { current: currentWorks, total: totalWorks } = this.state.data || {};
        const queryStatusPercentage = Number.parseFloat(currentWorks / totalWorks * 100).toFixed(0);

        //上传配置
        const uploadProps = {
            name: 'files',
            multiple: true,
            action: '/upload',
            fileList: this.state.fileList,
            showUploadList: false,
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
            }
        };

        const style = {
            marginTop: 10,
            display: 'block',
        }

        //steps配置
        const steps = [{
            title: '上传源代码',
            description: (
                <Upload {...uploadProps}>
                    <small style={style} >目前只支持 C、Python、Java文件检测</small>
                    <a style={style} >点击上传 （已选择{this.state.fileList.length}个文件）</a>
                    {this.state.fileList.length ? <Button type='primary' style={{ marginTop: 10 }} size='small' onClick={this.handleUpload}>开始检测</Button> : null}
                </Upload>
            )
        }, {
            title: this.state.title,
            icon: this.renderProcessStep(),
            description: (
                <React.Fragment>
                    {this.state.data ? (
                        <small>已检测  {queryStatusPercentage} %</small>
                    ) : null}
                </React.Fragment>)
        }, {
            title: STATUS_TITLE.SUCCESS_TITLE
        }];


        return (
            <PageHeaderLayout
                title='代码相似度检测'
                breadcrumbList={this.props.breadcrumbList}
                action={(
                    <React.Fragment>
                        查重等级：
                        <Select labelInValue defaultValue={this.state.detectLevel} onChange={this.handleChange}>
                            <Option value="l">初级查重</Option>
                            <Option value="h">高级查重</Option>
                        </Select>
                    </React.Fragment>
                )}
            >
                <Card title='检测进度' >
                    <Steps current={this.state.current}  >
                        {steps.map(item => <Step key={item.title} {...item} />)}
                    </Steps>
                </Card>
                {this.state.data && this.state.data.result ? <TestResult dataSource={this.state.data.result} /> : null}
            </PageHeaderLayout>
        )
    }
}