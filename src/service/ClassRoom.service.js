import { request } from '../utils/fetch';

/**
 * 修改班级信息
 * @param {Object} data 班级信息
 */
export const modifyClassInfo = data => {
    return request({
        url: `/grade/updateGrade`,
        data,
        method: 'post'
    })
}

/**
 * 获取班级列表
 */
export const getClass = (current = 0, pageSize = 10) => {
    return request({
        url: `/grade/getGradePage?current=${current}&pageSize=${pageSize}`,
        method: 'post'
    })
}

/**
 * 删除班级
 * @param {String} id 班级识别号
 */
export const deleteClass = id => {
    return request({
        url: `/grade/delGrade/${id}`,
        method: 'delete'
    })
}

/**
 * 新增班级
 * @param {Object} data 班级信息
 */
export const addClass = data => {
    return request({
        url: `/grade/addGrade`,
        method: 'post',
        data
    })
}

/**
 * 模糊搜索
 * @param {String} keyword 
 */
export const searchClass = keyword => {
    return request({
        url: `/grade/fuzzySearch/${keyword}`,
        method: 'post'
    })
}