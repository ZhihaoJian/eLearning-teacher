import React from 'react';
import SubjectType from './SubjectType';
import BraftEditor from 'braft-editor';
import { Divider } from 'antd';
import { editorProps } from '../../common/subject-config';
import { connect } from 'react-redux';
import { updateExamQuestion } from '../../redux/AddExam.redux';
import 'braft-editor/dist/braft.css';
import './BaseQuestionLayout.scss';


@connect(
    state => state.examsReducers,
    { updateExamQuestion }
)
export default function BaseQuestionLayout(ChildComponent) {
    return class wrapperComponent extends React.Component {

        state = {
            score: 1,
            questionContent: '',
            questionAnalyseContent: '',
            answer: null
        }

        onScoreChange = (score) => {
            this.setState({ score });
            this.props.updateExamQuestion({ score })
        }

        onQuestionEditorContentChange = questionContent => {
            this.setState({ questionContent });
            this.props.updateExamQuestion({ questionContent })
        }

        onQuestionAnalyseContentChange = questionAnalyseContent => {
            this.setState({ questionAnalyseContent });
            this.props.updateExamQuestion({ questionAnalyseContent })
        }

        onChildComponentChange = (answer) => {
            this.setState({ answer })
            this.props.updateExamQuestion({ answer })
        }

        render() {
            const { score, questionContent, questionAnalyseContent, answer } = { ...this.props, ...this.props.data };
            return (
                <div className='add-subject-container'  >
                    <SubjectType
                        onChange={score => this.onScoreChange(score)}
                        score={score}
                    />
                    <Divider />
                    <div className='subject-label' >题目内容:</div>
                    <BraftEditor
                        {...editorProps}
                        placeholder='请输入题干'
                        initialContent={questionContent}
                        ref={instance => this.questionEditorRef = instance}
                        onChange={content => this.onQuestionEditorContentChange(content)}
                    />
                    <Divider />
                    <div className='subject-label'>请输入回答:</div>
                    <div className='hint' >添加选项后, 请选中一个或多个答案作为标准答案</div>
                    {ChildComponent ? <ChildComponent
                        {...editorProps}
                        answer={answer}
                        onChange={value => this.onChildComponentChange(value)}
                    /> : null}
                    <Divider />
                    <div className='subject-label' >题目解析:</div>
                    <BraftEditor
                        {...editorProps}
                        placeholder='请输入题目解析'
                        initialContent={questionAnalyseContent}
                        ref={instance => this.questionAnalyseEditorRef = instance}
                        onChange={this.onQuestionAnalyseContentChange}
                    />
                </div>
            )
        }
    }
}