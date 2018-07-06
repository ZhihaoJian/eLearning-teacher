import React from 'react';
import { Upload, Icon, Button, Select, Steps, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { withRouter } from 'react-router-dom';
import TestResult from './TestResult';
import { detectCode, fetchProcessQueryStatus } from '../../service/SimilarCode.service';
import { STATUS_CODES, STATUS_TITLE } from './_variable';
const Step = Steps.Step;
const Option = Select.Option;

function stepsShowError() {
    this.setState({
        current: 1,
        stepsStatus: 'error',
        status: STATUS_CODES.ERROR,
        title: STATUS_TITLE.ERROR_TITLE
    });
}



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
            title: STATUS_TITLE.PENDING_TITLE,
            stepsStatus: '' //步骤条状态 error
        }
    }

    /**
     * 轮询任务队列
     */
    fetchProcessStatus = (url) => {
        //如果不存在URL在steps报错
        if (!url) {
            stepsShowError.apply(this);
            return;
        }
        return fetchProcessQueryStatus(url).then(res => {
            try {
                const state = res.state;
                const title = this.renderProcessStepTitle(state);
                if (state !== STATUS_CODES.SUCCESS) {
                    setTimeout(() => {
                        this.setState({ data: res, title, status: state }, () => {
                            this.fetchProcessStatus(url);
                        })
                    }, 2500);
                }
                else {
                    const { current } = this.state;
                    this.setState({
                        data: res,
                        current: current + 1,
                        status: state,
                        title
                    })
                }
            } catch (error) {
                stepsShowError.apply(this);
            }
        })
    }

    /**
     * 文件上传
     */
    handleUpload = (e) => {
        e.stopPropagation();

        this.setState({
            current: 0,
            status: '',
            stepsStatus: '',
            data: null,
            title: STATUS_TITLE.PENDING_TITLE
        }, () => {
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
        } else if (status === STATUS_CODES.PENDING || status === STATUS_CODES.PROGRESS) {
            return (<Icon type='loading' />)
        }
    }

    /**
     * 条件渲染step的检测title
     */
    renderProcessStepTitle = (status) => {
        if (status === STATUS_CODES.PENDING || status === STATUS_CODES.DEFAULT) {
            return STATUS_TITLE.PENDING_TITLE;
        } else if (status === STATUS_CODES.PROGRESS || status === STATUS_CODES.SUCCESS) {
            return STATUS_TITLE.PROGRESS_TITLE;
        } else if (status === STATUS_CODES.ERROR) {
            return STATUS_TITLE.ERROR_TITLE;
        }
    }

    /**
     * 渲染loading时候的描述
     */
    renderLoadingDesc = (queryStatusPercentage) => {
        if (this.state.status === STATUS_CODES.PENDING) {
            return '正在提交任务';
        } else if (this.state.status === STATUS_CODES.PROGRESS) {
            return <small>已检测  {queryStatusPercentage} %</small>
        } else {
            return '';
        }
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
            description: this.renderLoadingDesc(queryStatusPercentage)
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
                    <Steps current={this.state.current} status={this.state.stepsStatus} >
                        {steps.map(item => <Step key={item.title} {...item} />)}
                    </Steps>
                </Card>
                {this.state.data && this.state.data.result ? <TestResult dataSource={this.state.data.result} /> : null}
            </PageHeaderLayout>
        )
    }
}