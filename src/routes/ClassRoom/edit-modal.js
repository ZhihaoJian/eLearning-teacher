import React from 'react';
import { Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { ADD } from './const';
const FormItem = Form.Item;
const { TextArea } = Input;

class EditModal extends React.Component {

    onOk = () => {
        const form = this.props.form;
        const formData = form.getFieldsValue();
        this.props.onSubmit(formData);
    }

    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        //若存在classroom则代表是编辑功能，否则是新建功能;
        const { classroom } = this.props;
        return (
            <Modal
                title={this.props.type === ADD ? '新增班级' : '编辑班级信息'}
                destroyOnClose={true}
                visible={this.props.visible}
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                <Form layout='vertical'>
                    <FormItem>
                        {
                            getFieldDecorator('name', {
                                rules: [{ required: true, message: '班级名称不能为空' }],
                                initialValue: classroom ? classroom.name : ''
                            })(
                                <Input placeholder='这里写班级名称  例如：商业软件1班' size='large' />
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('description', {
                                rules: [{ required: false }],
                                initialValue: classroom ? classroom.description : ''
                            })(
                                <TextArea placeholder='这里写班级描述信息，可不填' ></TextArea>
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal.propTypes = {
    type: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    classroom: PropTypes.oneOfType([PropTypes.object])
}

EditModal.defaultProps = {
    visible: false,
    loading: false,
    classroom: null
}

export default EditModal = Form.create()(EditModal);