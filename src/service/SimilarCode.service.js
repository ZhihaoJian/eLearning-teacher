import { request } from '../utils/fetch';

export const detectCode = (formData) => {
    return request({
        method: 'post',
        url: `/detect`,
        data: formData
    })
}