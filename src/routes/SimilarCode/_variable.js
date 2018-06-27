//轮询队列状态码
const PENDING = 'PENDING';
const SUCCESS = 'SUCCESS';
const DEFAULT = '';
const PROGRESS = 'PROGRESS'

export const STATUS_CODES = {
    PENDING,
    SUCCESS,
    DEFAULT,
    PROGRESS
}

//轮询队列title
const PENDING_TITLE = '等待检测';
const PROGRESS_TITLE = '正在检测';
const SUCCESS_TITLE = '检测完成';

export const STATUS_TITLE = {
    PENDING_TITLE,
    PROGRESS_TITLE,
    SUCCESS_TITLE
}