import React from 'react';
import { Modal, Form, Input, InputNumber, Alert, Upload, Icon } from 'antd';
import PropTypes from 'prop-types';
import { Button } from 'antd/lib/radio';
import { COURSE_RESOURCE_PROPS_CONFIG } from '../../common/upload.config';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class AddNoteForm extends React.Component {

    state = {
        fileList: []
    }
    
    onOk = () => {
        const { fileList } = this.state;
        const data = this.props.form.getFieldsValue();
        const formData = new FormData();
        Object.keys(data).forEach(item => {
            if (item === 'coverURL') {
                formData.append('file', fileList[0])
            } else {
                formData.append([item], data[item]);
            }
        })

        this.props.onOk({ visible: false, data: formData });
    }

    onCancel = () => {
        this.setState({ fileList: [] })
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
                onOk={() => this.onOk()}
                onCancel={() => this.onCancel()}
            >
                <Alert style={{ marginBottom: 12 }} message="课程名称一旦确定将不能修改! 点击确定前再三确认!" banner />
                <Form layout='vertical'>
                    <FormItem label='课程名称'>
                        {getFieldDecorator('name', {
                            rules: [{ required: true }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='简介' >
                        {getFieldDecorator('description', {
                            rules: [{ required: false }]
                        })(
                            <TextArea />
                        )}
                    </FormItem>
                    <FormItem label='课程备注'>
                        {getFieldDecorator('remark', {
                            rules: [{ required: false }]
                        })(
                            <TextArea />
                        )}
                    </FormItem>
                    {/* <FormItem label='课程分类' >
                        {getFieldDecorator('type', {
                            rules: [{ required: false }]
                        })(
                            <Input />
                        )}
                    </FormItem> */}
                    <FormItem label='封面' >
                        {getFieldDecorator('coverURL', {
                            rules: [{ required: false }]
                        })(
                            <Upload {...COURSE_RESOURCE_PROPS_CONFIG(this, 'image')}>
                                <Button><Icon type='upload' />上传封面</Button></Upload>
                        )}
                    </FormItem>
                    {/* <FormItem label='学习人数' >
                        {getFieldDecorator('learningNumber', {
                            rules: [{ required: false }],
                            initialValue: 0
                        })(
                            <InputNumber min={0} style={{ width: '100%' }} />
                        )}
                    </FormItem> */}
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