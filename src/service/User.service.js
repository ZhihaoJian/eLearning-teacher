import { request } from '../utils/fetch';
import Axios from 'axios';
import { Utils } from '../utils/utils';

/**
 * 用户注册
 * @param {Object} data 
 */
export const Register = (data) => {
    return request({
        url: '/authority/register',
        data,
        method: 'post'
    }).then(res => {
        if (res) {
            Utils.setItemToLocalStorage({ userid: res.id });
            return res;
        }
    })
}

/**
 * 验证码异步验证
 * @param {String} captcha 
 */
export const validateCaptcha = (captcha) => {
    return Axios.post(`/authority/verify/${captcha}`).then(res => res.data.success);
}

/**
 * 用户登录
 * @param {Object} data 
 */
export const UserLogin = (data) => {
    return request({
        url: '/authority/login',
        data,
        method: 'post'
    }).then(res => {
        if (res) {
            const { user } = res;
            const token = JSON.stringify({ token: res.token, setTime: Date.now() });
            Utils.setItemToLocalStorage({ token }, { user: JSON.stringify(user) });
            return user;
        }
    })
}