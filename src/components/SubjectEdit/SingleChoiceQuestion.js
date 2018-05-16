import React from 'react';
import BaseQuestionLayout from './BaseQuestionLayout';
import PropTypes from 'prop-types';
import { Radio, Input } from 'antd';
const RadioGroup = Radio.Group;


class SingleChoiceQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: (props.answer && props.answer.value) || 0,
            optionList: (props.answer && props.answer.optionList) || []
        }
    }

    onBlur = (e) => {
        const content = e.target.value;
        const maxValue = this.state.optionList.length;
        const optionList = this.state.optionList;

        if (!content) {
            return;
        }
        optionList.push({
            value: maxValue + 1,
            content
        });

        this.props.onChange({ optionList });
    }

    onChange = (e) => {
        const value = e.target.value;
        this.setState({ value }, () => {
            this.props.onChange({ ...this.state });
        });
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <RadioGroup onChange={e => this.onChange(e)} value={this.state.value} >
                {this.state.optionList.map((v, idx) => (<Radio style={radioStyle} key={idx} value={v.value} >{v.content}</Radio>))}
                <Radio style={radioStyle} value={100} >
                    添加选项
                    {this.state.value === 100 ? <Input style={{ width: 150, marginLeft: 10 }} onBlur={this.onBlur} /> : null}
                </Radio>
            </RadioGroup>
        )
    }
}

SingleChoiceQuestion.propTypes = {
    onChange: PropTypes.func
}

export default BaseQuestionLayout(SingleChoiceQuestion)