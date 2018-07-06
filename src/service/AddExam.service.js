import { request } from '../utils/fetch';
import { message } from 'antd';

export const loadCourseList = (pageSize, current) => {
    return request({
        url: '/course/getCourseList',
        params: {
            pageSize,
            current
        }
    })
}

export const deleteCourse = id => {
    return request({
        method: 'delete',
        url: `/teacher/delCourse/${id}`,
    })
}

export const addCourseInfo = (formData) => {
    return request({
        method: 'post',
        url: `/teacher/addCourse`,
        data: formData
    }).then(response => response.id);
}

/**
 * 发布备课信息
 * @param {String} courseId 课程ID
 */
export const announceCourse = (courseId) => {
    return request({
        method: 'post',
        url: `/teacher/announceCourse/${courseId}`,
    }).then(res => {
        message.success(res)
    })
}