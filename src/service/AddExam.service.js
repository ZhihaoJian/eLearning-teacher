import { request } from '../utils/fetch';

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

export const uploadCourseResource = formData => {
    return request({
        method: 'post',
        url: `//jsonplaceholder.typicode.com/posts/`,
        data: formData
    });
}

export const addTreeNote = (data) => {
    return request({
        method: 'post',
        url: `/courseNode/addCourseNode`,
    });
}