import React from 'react';
import { connect } from 'react-redux';
import { submitNewExam, updateExamQuestion } from '../../redux/AddExam.redux';
import { examData } from '../../mock/data';
import EditExamArea from '../Examination/EditExamArea';
@connect(
    state => state.examsReducers,
    { submitNewExam, updateExamQuestion }
)
class AddExam extends React.Component {
    render() {
        return (
            <EditExamArea
                breadcrumbList={this.props.breadcrumbList}
                data={examData}
                alreayPublished={false}
            />
        )
    }
}

export default AddExam;