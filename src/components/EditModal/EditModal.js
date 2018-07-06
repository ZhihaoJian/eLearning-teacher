import React from 'react';
import { Modal, Select } from 'antd';
import { subjectConfig, loadDynamicComponent } from '../../common/subject-config';
import { connect } from 'react-redux';
import { reset } from '../../redux/AddExam.redux';
import PropTypes from 'prop-types';

const Option = Select.Option;

@connect(
    state => state.examsReducers,
    { reset }
)
export default class EditModal extends React.Component {

    state = {
        type: ''
    }

    onSelectChange = (type) => {
        this.setState({ type }, () => {
            this.props.updateExamQuestion(this.state.type)
        })
    }

    onCancel = () => {
        this.setState({ type: '' });
        this.props.onCancel({ visible: false, type: '' });
        this.props.reset();
    }

    render() {
        const { visible, title, showTitle, type, data } = { ...this.props, ...this.props.data };
        const DynamicComponent = type ? loadDynamicComponent(type) : null;
        return (
            <Modal
                destroyOnClose={true}
                width={1000}
                maskClosable={false}
                visible={visible}
                onOk={() => this.props.onOk()}
                onCancel={() => this.onCancel()}
                title={title}
                okText="确认"
                cancelText="取消"
            >
                {
                    showTitle ? (
                        <React.Fragment>
                            <span style={{ marginRight: 10 }}>题目类型</span>
                            <Select onChange={type => this.onSelectChange(type)} style={{ width: 120 }} >
                                {subjectConfig.map((v, idx) => (<Option key={idx} value={v.type}>{v.type}</Option>))}
                            </Select>
                        </React.Fragment>
                    ) : null
                }
                {
                    DynamicComponent ?
                        <DynamicComponent
                            data={data ? data : []}
                            type={type}
                            {...this.props}
                        /> : null
                }
            </Modal>
        )
    }
}

EditModal.propTypes = {
    type: PropTypes.string,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    showTitle: PropTypes.bool,
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    updateExamQuestion: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

EditModal.defaultProps = {
    title: '编辑试题',
    showTitle: false,
    visible: false,
    data: [],
    type: ''
}