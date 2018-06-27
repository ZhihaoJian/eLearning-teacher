import { request } from '../utils/fetch';

export const detectCode = (formData) => {
    return request({
        method: 'post',
        url: `/detect`,
        data: formData
    })
}

/**
 * 队列检测
 */
export const fetchProcessQueryStatus = (url) => {
    return request({
        method: 'get',
        url
    })
}