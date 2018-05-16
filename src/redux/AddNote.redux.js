import Axios from "axios";
import { message } from 'antd';

const ADD_TEXT = 'ADD_TEXT';
const ADD_FOLDER = 'ADD_FOLDER';
const SAVE = 'SAVE';
const UPLOAD = 'UPLOAD';
const ADD_COURSE_INFO = 'ADD_COURSE_INFO';
const LOAD_COURSE_LIST = 'LOAD_COURSE_LIST';
const DELETE_COURSE = 'DELETE_COURSE';
const LOAD_HISTORY_NOTE_INFO = 'LOAD_HISTORY_NOTE_INFO';
const RESET = 'RESET';
const initState = {
    treeData: [],
    courseInfo: {},
    courseList: []
}

export const addNoteReducers = (state = initState, action) => {
    switch (action.type) {
        case ADD_COURSE_INFO:
            return { ...initState, courseInfo: action.payload };
        case LOAD_COURSE_LIST:
            return { ...initState, courseList: action.payload }
        case ADD_TEXT:
            return {};
        case LOAD_HISTORY_NOTE_INFO:
            return {};
        case DELETE_COURSE:
            return {};
        case ADD_FOLDER:
            return {};
        case RESET:
        default:
            return initState;
    }
}

export const onAddText = () => {
    return dispatch => dispatch({ type: ADD_TEXT })
}

export const onAddFolder = () => {
    return dispatch => dispatch({ type: ADD_FOLDER })
}

export const onSave = () => {
    return dispatch => dispatch({ type: SAVE })
}

export const onUpload = () => {
    return dispatch => dispatch({ type: UPLOAD })
}

/**
 * 加载备课信息
 * @param {pageSize} 分页大小
 * @param {current} 当前页
 */
export const loadCourseList = ({ pageSize = 10, current = 0 } = {}) => {
    return dispatch => {
        return Axios.get(`/course/getCourseList?pageSize=${pageSize}&current=${current}`)
            .then(res => {
                if (res.status === 200 && res.data.status === 0) {
                    dispatch({ type: LOAD_COURSE_LIST, payload: res.data.result.content })
                } else {
                    message.error('Oops,网络貌似异常了! 刷新试一下?');
                }
            })
            .catch(err => {
                message.error('Oops,网络貌似异常了! 请重新尝试一下?')
            })
    }
}

/**
 * 添加备课
 * @param {*} formData 备课信息
 */
export const addCourseInfo = (formData) => {
    return dispatch => {
        return Axios.post('/teacher/addCourse', formData)
            .then(res => {
                if (res.status === 200 && res.data.status === 0) {
                    dispatch({ type: ADD_COURSE_INFO, payload: res.data.result })
                    message.success('正在为您准备备课区, 请耐心等待!');
                } else {
                    message.error('添加错误!');
                }
                return res.data.result.id;
            })
            .catch(err => {
                message.error('Oops,网络貌似异常了! 请重新尝试一下?')
            })
    }
}

/**
 * 删除指定备课信息
 * @param {*} id 备课ID
 */
export const deleteCourse = (id) => {
    return dispatch => {
        return Axios.delete(`/teacher/delCourse/${id}`)
            .then(res => {
                if (res.status === 200 && res.data.status === 0) {
                    dispatch({ type: DELETE_COURSE, payload: res.data.result })
                    message.success('删除成功!');
                } else {
                    message.error('Oops,网络貌似异常了! 请刷新后重新尝试一下?');
                }
            })
            .catch(err => {
                message.error('Oops,网络貌似异常了! 请重新尝试一下?')
            })
    }
}

/**
 * 无论是新建或者编辑现有备课，均加载历史备课目录树信息
 * @param {*} id 备课ID
 */
export const onLoadHistoryNoteInfo = id => {
    return dispatch => {
        return Axios.delete(``)
            .then(res => {
                if (res.status === 200 && res.data.status === 0) {
                    dispatch({ type: LOAD_HISTORY_NOTE_INFO, payload: res.data.result })
                } else {
                    message.error('Oops,网络貌似异常了! 请刷新后重新尝试一下?');
                }
            })
            .catch(err => {
                message.error('Oops,网络貌似异常了! 请重新尝试一下?')
            })
    }
}