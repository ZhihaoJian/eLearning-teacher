import React from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';

class SubjectType extends React.Component {

    onChange = score => {
        this.props.onChange(score);
    }

    render() {
        return (
            <div>
                <span>分值：</span>
                <InputNumber
                    value={this.props.score}
                    defaultValue={1}
                    min={1}
                    className='score'
                    onChange={this.onChange}
                />
                <span >分</span>
            </div>
        )
    }
}

SubjectType.propTypes = {
    onChange: PropTypes.func,
    score: PropTypes.number
}

export default SubjectType;