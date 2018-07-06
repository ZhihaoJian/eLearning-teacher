import { Modal } from 'antd';

/**
 * 通用工具
 */
const Utils = (function (window) {
    return {
        /**
         * 从localstorage中移除指定的Item,
         * 若key不传入则默认移除所有item
         */
        removeItemFromLocalStorage: function (key) {
            if (key) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.clear();
            }
        },
        /**
         * 设置localstorage，
         * item 为 {key:value}
         */
        setItemToLocalStorage: function (...item) {
            for (let i = 0; i < item.length; i++) {
                const key = Object.keys(item[i]);
                window.localStorage.setItem(key, item[i][key]);
            }
        },
        /**
         * 读取本地存储
         */
        getItemFromLocalStorage: function (key) {
            if (key) {
                return window.localStorage.getItem(key)
            } else {
                console.warn('You should pass a key to access localstorage');
            }
        },
        /**
         * 各类操作成功后的模态框
         */
        success: function (msg = '') {
            const modal = Modal.success({
                title: '操作成功',
                content: msg,
            });
            setTimeout(() => modal.destroy(), 1000);
        },
        error: function (msg = '') {
            const modal = Modal.error({
                title: '操作失败',
                content: msg
            });
            setTimeout(() => modal.destroy(), 1000);
        }
    }
})(window)

export { Utils }