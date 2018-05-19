import { request } from '../utils/fetch';

export const detectCode = ({ formData, level }) => {
    return request({
        method: 'post',
        url: `/detect?level=${level.key}`,
        data: formData
    })
}