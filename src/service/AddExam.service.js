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
        url: `/import/uploadVideo`,
        data: formData
    });
}

/**
 * 添加节点
 * @param {object} node 
 */
export const onAddTreeNode = (data) => {
    return request({
        method: 'post',
        url: `/courseNode/addCourseNode`,
        data
    });
}

/**
 * 加载tree的root节点
 */
export const onLoadTree = () => {
    return request({
        method: 'post',
        url: `/courseNode/findCourseNodeByIsRoot/${true}`,
    });
}

/**
 * 展开tree node 加载 child node
 * @param {string} key 展开结点的 key
 */
export const onLoadChildData = (key) => {
    return request({
        method: 'post',
        url: `/courseNode/findCourseNode/${key}`
    })
}

/**
 * 删除制定节点
 * @param {string} key 选中删除节点的key值
 */
export const onDeleteNode = (key) => {
    return request({
        method: 'post',
        url: `/courseNode/delCourseNode/${key}`
    })
}

/**
 * 修改节点名称 
 * @param {*} data 节点信息，包含节点ID和修改的名称
 */
export const onUpdateNodeName = (data) => {
    return request({
        method: 'post',
        url: `/courseNode/updateCourseNodeName`,
        data
    })
}


/**
 * 同步文本内容
 * @param {Object} data 保存信息
 */
export const updateCourseNodeContent = (data) => {
    return request({
        method: 'post',
        url: `/courseNode/updateContentById`,
        data
    })
}