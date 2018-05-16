import React from 'react';
import { Radio } from 'antd';
import BaseQuestionLayout from './BaseQuestionLayout';
import PropTypes from 'prop-types';
const RadioGroup = Radio.Group;

class Judgment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: true
        }
    }

    onChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const { answer } = this.props;

        return (
            <RadioGroup onChange={this.onChange} value={answer} >
                <Radio style={radioStyle} value={true}>正确</Radio>
                <Radio style={radioStyle} value={false}>错误</Radio>
            </RadioGroup >
        )
    }
}

Judgment.propTypes = {
    onChange: PropTypes.func,
    answer: PropTypes.bool
}

export default BaseQuestionLayout(Judgment);
