import Axios from "axios";
import { message } from 'antd';
import { Utils } from "./utils";

export const request = ({ url = '', method = 'get', data = {}, params = {}, ...restParams }) => {
    const token = `Bearer${Utils.getItemFromLocalStorage('token')}`;
    return Axios({
        method,
        url,
        params,
        data: method !== 'get' ? data : null,
        headers: {
            Authorization: token
        },
        ...restParams
    })
        .then(response => {
            if (response.status === 200 && response.data.status === 0) {
                return response.data.result;
            } else {
                throw new Error(response.data.msg);
            }
        })
        .catch(err => {
            message.error(err.message || 'Oops, 网络出错了! 刷新试试?')
        })
}