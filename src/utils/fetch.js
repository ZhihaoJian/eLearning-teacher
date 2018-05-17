import Axios from "axios";
import { message } from 'antd';

export const request = ({ url = '', method = 'get', data = {}, params = {}, ...restParams }) => {
    return Axios({
        method,
        url,
        params,
        data: method !== 'get' ? data : null,
        ...restParams
    })
        .then(response => {
            if (response.status === 200 && response.data.status === 0) {
                return response.data.result;
            } else {
                throw new Error();
            }
        })
        .catch(err => message.error('Oops, 网络出错了! 刷新试试?'))
}