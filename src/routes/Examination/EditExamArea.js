import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Card, List, Popconfirm, Checkbox, Radio, Modal } from 'antd';
import EditModal from '../../components/EditModal/EditModal';
import { radioStyle } from '../../common/subject-config';
import PropTypes from 'prop-types';

const ButtonGroup = Button.Group;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

export default class EditExamArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: '',
            editExamVisible: false,
            addExamVisible: false,
            quiz: null,
            saveLoading: false,
            publishLoading: false
        }
    }

    renderQuiz = (data) => {
        let card;
        if (data.type === '单选题') {
            card = (
                <RadioGroup value={data.answer.value} >
                    {
                        data.answer.optionList.map((option, idx) => (
                            <Radio key={idx} style={radioStyle} value={option.value}>{option.content}</Radio>
                        ))
                    }
                </RadioGroup>
            )
        } else if (data.type === '判断题') {
            card = (
                <RadioGroup value={data.answer}>
                    <Radio style={radioStyle} value={true} >正确</Radio>
                    <Radio style={radioStyle} value={false} >错误</Radio>
                </RadioGroup>
            )
        } else if (data.type === '多选题') {
            card = (
                <CheckboxGroup defaultValue={data.answer.checkedValues} >
                    {
                        data.answer.plainOptions.map((item, idx) => (
                            <Checkbox key={idx} value={item} >{item}</Checkbox>
                        ))
                    }
                </CheckboxGroup>
            )
        }
        return card;
    }

    onOk = () => {
        this.props.submitNewExam();
        this.setState({ visible: false })
    }

    onEdit = (e) => {
        const type = e.target.dataset['type'];
        this.setState({ editExamVisible: true, type })
    }

    onCancel = () => {
        Modal.confirm({
            title: '警告',
            content: '是否要取消编辑? 尚未保存的内容将会丢失!',
            onOk: () => {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            }
        })
    }


    onSelectChange = (type) => {
        this.setState({ type });
        this.props.updateExamQuestion({ type })
    }

    render() {
        const { data, alreayPublished, title } = this.props;
        return (
            <PageHeaderLayout
                title={title}
                breadcrumbList={this.props.breadcrumbList}
                action={(
                    <React.Fragment>
                        {
                            !alreayPublished ? (
                                <ButtonGroup>
                                    <Button
                                        onClick={() => this.setState({ addExamVisible: true })}
                                        type='dashed'
                                        className='add-subject-btn'
                                    >添加题目</Button>
                                    <Button
                                        loading={this.state.saveLoading}
                                        onClick={() => {
                                            this.setState({ saveLoading: true });
                                            return new Promise((resolve, reject) => {
                                                setTimeout(() => {
                                                    this.setState({ saveLoading: false })
                                                    resolve();
                                                }, 1000);
                                            }).catch(err => console.log(err))
                                        }}
                                    >保存</Button>
                                    <Button
                                        type="primary"
                                        loading={this.state.publishLoading}
                                        onClick={() => {
                                            this.setState({ publishLoading: true });
                                            return new Promise((resolve, reject) => {
                                                setTimeout(() => {
                                                    this.setState({ publishLoading: false })
                                                    resolve();
                                                }, 1000);
                                            }).catch(err => console.log(err))
                                        }}
                                    >发布</Button>
                                    <Button
                                        type="danger"
                                        onClick={() => this.onCancel()}
                                    >取消</Button>
                                </ButtonGroup>
                            ) : null
                        }
                    </ React.Fragment>
                )}
            >
                <Card className='edit-subject-list-container' >
                    <List
                        itemLayout='vertical'
                        size='large'
                        pagination
                        dataSource={data}
                        renderItem={(item, idx) => (
                            <List.Item
                                key={idx}
                                actions={
                                    [
                                        <a data-type={item.type} onClick={(e) => this.onEdit(e)} >编辑</a>,
                                        <Popconfirm title='确定要删除?' onConfirm={this.onDelete} placement='right' ><a>删除</a></Popconfirm>
                                    ]
                                }
                            >
                                <List.Item.Meta
                                    title={`${idx + 1}、${item.questionContent}    ( ${item.score}分 )`}
                                />
                                {this.renderQuiz(item)}
                            </ List.Item>
                        )}
                    />
                </Card>
                <EditModal
                    showTitle={true}
                    visible={this.state.addExamVisible}
                    onOk={this.onOk}
                    onCancel={({ addExamVisible, type }) => {
                        this.setState({ addExamVisible, type })
                    }}
                        updateExamQuestion={type => this.props.updateExamQuestion({ type })}
                />
                <EditModal
                    type={this.state.type}
                    visible={this.state.editExamVisible}
                    onOk={() => this.onOk()}
                    onCancel={({ editExamVisible, type }) => {
                        this.setState({ editExamVisible, type })
                    }}
                    updateExamQuestion={type => this.props.updateExamQuestion({ type })}
                    data={data[0]}
                />
            </PageHeaderLayout>
        )
    }
}

EditExamArea.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    alreayPublished: PropTypes.bool
}

EditExamArea.defaultProps = {
    data: [],
    title: '编辑试题',
    alreayPublished: false
}