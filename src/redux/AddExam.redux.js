const UPDATE_EXAM_QUESTION = 'UPDATE_EXAM_QUESTION';
const SUBMIT_NEW_EXAM = 'SUBMIT_NEW_EXAM';
const RESET = 'RESET';
const initState = {
    score: 1,
    questionContent: '',
    questionAnalyseContent: '',
    answer: undefined,
    type: ''
}

export function examsReducers(state = initState, action) {
    switch (action.type) {
        case UPDATE_EXAM_QUESTION:
            return { ...state, ...action.payload }
        case SUBMIT_NEW_EXAM:
            return { ...state }
        case RESET:
        default:
            return initState;
    }
}

export const submitNewExam = (exam) => {
    return dispatch => dispatch({ type: SUBMIT_NEW_EXAM })
}

export const updateExamQuestion = (exam) => {
    return dispatch => dispatch({ type: UPDATE_EXAM_QUESTION, payload: exam });
}

export const reset = () => {
    return { type: RESET }
}