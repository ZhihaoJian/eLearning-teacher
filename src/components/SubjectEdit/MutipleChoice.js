import React from 'react';
import BaseQuestionLayout from './BaseQuestionLayout';
import { Checkbox, Input, Icon } from 'antd';
import PropTypes from 'prop-types';

const CheckboxGroup = Checkbox.Group;
const ADD = 'ADD';
const CANCEL = 'CANCEL';

class MutipleChoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            newAnswer: '',
            checkedValues: (props.answer && props.answer.checkedValues) || [],
            plainOptions: (props.answer && props.answer.plainOptions) || [],
        }
    }

    onChange = (checkedValues) => {
        this.props.onChange({
            checkedValues,
            plainOptions: this.state.plainOptions
        });
    }

    onAdd = (e) => {
        e.stopPropagation();
        const type = e.target.dataset['type'];
        const { plainOptions, newAnswer } = this.state;
        if (type === ADD) {
            plainOptions.push(newAnswer);
            this.setState({ plainOptions, visible: false });
        } else {
            this.setState({ visible: false, newAnswer: '' })
        }
        this.props.onChange({
            plainOptions: this.state.plainOptions
        })
    }

    handleAddAnswer = () => {
        this.setState({ visible: true })
    }

    render() {
        let { plainOptions } = this.state;
        return (
            <React.Fragment>
                <CheckboxGroup onChange={this.onChange} value={this.state.checkedValues} >
                    {plainOptions.map((v, idx) => (
                        <Checkbox value={v} key={idx}>{v}</Checkbox>
                    ))}
                    {
                        !this.state.visible ? (
                            <span style={{ marginLeft: 10 }} >
                                <a onClick={this.handleAddAnswer} >添加回答</a>
                            </span>
                        ) : (
                                <span style={{ marginLeft: 10 }} >
                                    <Input placeholder='请输入答案' onChange={e => this.setState({ newAnswer: e.target.value })} style={{ width: 100 }} />
                                    <span style={{ marginLeft: 10 }} onClick={e => this.onAdd(e)}  >
                                        <Icon type='check' data-type={ADD} style={{ color: 'green', fontSize: 20, cursor: 'pointer' }} title='添加答案' />
                                        <Icon type='close' data-type={CANCEL} style={{ color: 'red', fontSize: 20, cursor: 'pointer' }} title='取消' />
                                    </span>
                                </span>
                            )
                    }
                </CheckboxGroup>
            </React.Fragment >
        )
    }
}

MutipleChoice.propTypes = {
    onChange: PropTypes.func
}

export default BaseQuestionLayout(MutipleChoice);

