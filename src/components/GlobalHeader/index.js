import { Icon, Tag, Popover, Avatar, Layout } from 'antd';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import React from 'react';
import './index.scss';
import { withRouter } from 'react-router-dom';
import { Utils } from '../../utils/utils';
const { Header } = Layout;

const data = [
    {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: '通知',
    }, {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: '你推荐的 曲妮妮 已通过第三轮面试',
        datetime: '2017-08-08',
        type: '通知',
    }, {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: '这种模板可以区分多种通知类型',
        datetime: '2017-08-07',
        read: true,
        type: '通知',
    }, {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: '左侧图标用于区分不同的类型',
        datetime: '2017-08-07',
        type: '通知',
    }, {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '内容不要超过两行字，超出时自动截断',
        datetime: '2017-08-07',
        type: '通知',
    }, {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '曲丽丽 评论了你',
        description: '描述信息描述信息描述信息',
        datetime: '2017-08-07',
        type: '消息',
    }, {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '朱偏右 回复了你',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: '消息',
    }, {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '标题',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: '消息',
    }, {
        id: '000000009',
        title: '任务名称',
        description: '任务需要在 2017-01-12 20:00 前启动',
        extra: '未开始',
        status: 'todo',
        type: '待办',
    }, {
        id: '000000010',
        title: '第三方紧急代码变更',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '马上到期',
        status: 'urgent',
        type: '待办',
    }, {
        id: '000000011',
        title: '信息安全考试',
        description: '指派竹尔于 2017-01-09 前完成更新并发布',
        extra: '已耗时 8 天',
        status: 'doing',
        type: '待办',
    }, {
        id: '000000012',
        title: 'ABCD 版本发布',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '进行中',
        status: 'processing',
        type: '待办',
    }];



@withRouter
export default class GlobalHeader extends React.Component {

    toggle = () => {
        const collapsed = !this.props.collapsed;
        this.props.toggle(collapsed);
    }

    onItemClick = (item, tabProps) => {
        console.log(item, tabProps);
    }

    onClear = (tabTitle) => {
        console.log(tabTitle);
    }

    getNoticeData = (notices) => {
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map((notice) => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            // transform id to item key
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = ({
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                })[newNotice.status];
                newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }

    onLogout = (e) => {
        e.stopPropagation();
        Utils.removeItemFromLocalStorage();
        this.props.history.push('/signin');
    }

    render() {
        const noticeData = this.getNoticeData(data);
        const username = JSON.parse(Utils.getItemFromLocalStorage('user')).username;
        const avatarPopMenu = (
            <div className='avatar-pop-menu' >
                <div className='menu-item' ><Icon type="user" className='icon' /><span className='setting-name'>个人中心</span></div>
                <div className='menu-item' ><Icon type="tool" className='icon' /><span className='setting-name'>设置</span></div>
                <div className='menu-item' onClick={e => this.onLogout(e)}  ><Icon type="logout" /><span className='setting-name'>登出</span></div>
            </div>
        )

        return (
            <Header className='header' >
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div className='opera-container'>
                    <HeaderSearch
                        className='header-search'
                        placeholder="站内搜索"
                        dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                        onSearch={(value) => {
                            console.log('input', value);
                        }}
                        onPressEnter={(value) => {
                            console.log('enter', value);
                        }}
                    />
                    <NoticeIcon
                        className="notice-icon"
                        count={5}
                        onItemClick={this.onItemClick}
                        onClear={this.onClear}
                        popupAlign={{ offset: [20, -16] }}
                    >
                        <NoticeIcon.Tab
                            list={noticeData['通知']}
                            title="通知"
                            emptyText="你已查看所有通知"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                        />
                        <NoticeIcon.Tab
                            list={noticeData['消息']}
                            title="消息"
                            emptyText="您已读完所有消息"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                        />
                        <NoticeIcon.Tab
                            list={noticeData['待办']}
                            title="待办"
                            emptyText="你已完成所有待办"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                        />
                    </NoticeIcon>
                    <Popover content={avatarPopMenu} placement='bottom'>
                        <div className='avatar-container' >
                            <Avatar src='data:image/jpeg;base64,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' size='small' icon="user" className='avatar' />
                            <span className='name' >{username}</span>
                        </div>
                    </Popover>
                </div>
            </Header>
        )
    }
}