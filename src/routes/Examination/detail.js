import React from 'react';
import { connect } from 'react-redux';
import { submitNewExam, updateExamQuestion } from '../../redux/AddExam.redux';
import { examData } from '../../mock/data';
import { withRouter } from 'react-router-dom';
import QueryString from '../../utils/query-string';
import EditExamArea from './EditExamArea';

@withRouter
@connect(
    state => state.examsReducers,
    { submitNewExam, updateExamQuestion }
)
export default class AddExam extends React.Component {
    render() {
        const alreayPublished = Number.parseInt(QueryString.parse(this.props.location.search).status, 10) ? true : false;
        return (
            <EditExamArea
                title={QueryString.parse(this.props.location.search).examName}
                breadcrumbList={this.props.breadcrumbList}
                data={examData}
                alreayPublished={alreayPublished}
                updateExamQuestion={exam => this.props.updateExamQuestion(exam)}
            />
        )
    }
}