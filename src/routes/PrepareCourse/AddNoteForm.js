import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class AddNoteForm extends React.Component {

    onOk = () => {
        const data = this.props.form.getFieldsValue();
        this.props.onOk({ visible: false, data });
    }

    onCancel = () => {
        this.props.onCancel({ visible: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title='添加课程信息'
                confirmLoading={this.props.confirmLoading}
                destroyOnClose={true}
                maskClosable={false}
                visible={this.props.visible}
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                <Form layout='vertical'>
                    <FormItem label='课程名称'>
                        {getFieldDecorator('name', {
                            rules: [{ required: true }]
                        })(
                            <Input placeholder='课程名称' />
                        )}
                    </FormItem>
                    <FormItem label='简介' >
                        {getFieldDecorator('description', {
                            rules: [{ required: false }]
                        })(
                            <TextArea placeholder='' />
                        )}
                    </FormItem>
                    <FormItem label='课程备注'>
                        {getFieldDecorator('remark', {
                            rules: [{ required: false }]
                        })(
                            <Input placeholder='课程备注' />
                        )}
                    </FormItem>
                    <FormItem label='课程分类' >
                        {getFieldDecorator('type', {
                            rules: [{ required: false }]
                        })(
                            <Input placeholder='课程分类' />
                        )}
                    </FormItem>
                    <FormItem label='封面' >
                        {getFieldDecorator('coverURL', {
                            rules: [{ required: false }]
                        })(
                            <Input placeholder='封面' />
                        )}
                    </FormItem>
                    <FormItem label='路径' >
                        {getFieldDecorator('videoURL', {
                            rules: [{ required: false }]
                        })(
                            <Input placeholder='路径' />
                        )}
                    </FormItem>
                    <FormItem label='学习人数' >
                        {getFieldDecorator('learningNumber', {
                            rules: [{ required: false }]
                        })(
                            <InputNumber min={0} placeholder='请输入学习人数' style={{ width: '100%' }} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

AddNoteForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    confirmLoading: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

AddNoteForm.defaultProps = {
    visible: false,
    confirmLoading: false
}

export default Form.create()(AddNoteForm);