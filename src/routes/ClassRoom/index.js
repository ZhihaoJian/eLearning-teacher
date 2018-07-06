import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Icon, Popover, Popconfirm, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import CardList from '../../components/CardList/CardList';
import EditModal from './edit-modal';
import { modifyClassInfo, addClass, getClass, deleteClass, searchClass } from '../../service/ClassRoom.service';
import { Utils } from '../../utils/utils';
import { ADD, EDIT, DEFAULT_TYPE } from './const';
import './index.scss';

const Search = Input.Search;

@withRouter
export default class ClassRoom extends React.Component {

    state = {
        visible: false,     //编辑班级信息模态框是否可见
        loading: false,
        type: '',           //操作类型。分为'EDIT'与'ADD',
        classList: [],      //班级列表
        pagination: null,   //分页配置
        classroom: null     //模态框回填信息;
    }

    componentDidMount() {
        this.fetchClassRoom();
    }

    /**
     * 加载班级列表
     */
    fetchClassRoom = (current = 0, pageSize = 8) => {
        this.setState({ loading: true })
        getClass(current, pageSize).then(res => {
            try {
                this.setState({
                    classList: res.content,
                    loading: false,
                    pagination: {
                        total: res.totalElements,
                        current: res.pageable.pageNumber + 1,
                        pageSize,
                    }
                })
            } catch (error) {
                // Utils.error('网络错误,请重试');
                this.setState({ loading: false })
            }
        });
    }

    /**
     * 删除指定班级
     */
    deleteClassroom = (e, id) => {
        deleteClass(id).then(res => {
            if (res) {
                Utils.success();
            } else {
                Utils.error();
            }
            this.fetchClassRoom();
        })
    }

    /**
     * 模糊搜索
     */
    onSearch = value => {
        searchClass(value).then(res => {
            try {
                this.setState({ classList: res.content })
            } catch (error) {
                // Utils.error('网络错误');
            }
        })
    }

    /**
     * 编辑课程基本信息 
     */
    editClass = (e, type) => {
        e.stopPropagation();
        let classroom;
        if (type === EDIT) {
            classroom = JSON.parse(e.currentTarget.dataset['classroom']);
            this.setState({ visible: true, type, classroom })
        } else {
            this.setState({ visible: true, type })
        }
    }

    /**
     * 编辑提交
     * @param {Object} data
     */
    onEditSubmit = data => {
        const { type, classroom } = this.state;
        data = { ...classroom, ...data };
        if (type === EDIT) {
            modifyClassInfo(data).then(res => {
                this.onEditSubmitCallBack();
            })
        } else if (type === ADD) {
            addClass(data).then(res => {
                this.onEditSubmitCallBack();
            })
        }
    }

    /**
     * 渲染分页
     */
    rendePagination = () => {
        const { pagination } = this.state;
        const that = this;
        let paginationInfo = Object.assign({ showQuickJumper: true }, pagination);
        paginationInfo.onChange = function (page, pageSize) {
            that.fetchClassRoom(page - 1);
        }
        return paginationInfo;
    }

    /**
     * 编辑/新建 成功回调
     */
    onEditSubmitCallBack = () => {
        this.setState({ visible: false, type: DEFAULT_TYPE, classroom: null });
        Utils.success();
        this.fetchClassRoom();
    }

    /**
     * 渲染action图标
     */
    renderActions = (item) => {
        const id = item.id;
        return [
            <Popconfirm
                placement="bottom"
                title={'确定要删除该班级?'}
                okType='danger'
                onConfirm={e => this.deleteClassroom(e, id)}
                okText="我确定"
                cancelText="再想想"
            >
                <Icon type="delete" title='删除班级' />,
            </Popconfirm>,
            <Icon type="edit" title='编辑' data-classroom={JSON.stringify(item)} onClick={e => this.editClass(e, EDIT)} />,
            <Popover
                placement='bottomLeft'
                title='分享至'
                content={(
                    <div className='opera-icon' >
                        <Icon type="qq" title='分享到QQ' />
                        <Icon type="wechat" title='分享给微信好友' />
                        <Icon type="google-plus" title='分享到 Google Plus 社区' />
                    </div>
                )}
            >
                <Icon type="share-alt" title='分享' />
            </Popover>
        ]
    }

    render() {
        return (
            <PageHeaderLayout
                title='班级列表'
                breadcrumbList={this.props.breadcrumbList}
                extraContent={(<Button type='primary' onClick={e => this.editClass(e, ADD)} >新建班级</Button>)}
                action={(
                    <Search
                        placeholder="输入检索内容，然后回车"
                        onSearch={value => this.onSearch(value)}
                        style={{ width: 200 }}
                    />
                )}
            >
                <CardList
                    actions={this.renderActions}
                    data={this.state.classList}
                    pagination={this.rendePagination()}
                    loading={this.state.loading}
                />
                <EditModal
                    classroom={this.state.classroom}
                    type={this.state.type}
                    visible={this.state.visible}
                    onSubmit={data => this.onEditSubmit(data)}
                    onCancel={() => this.setState({ visible: false, type: DEFAULT_TYPE, classroom: null })}
                />
            </PageHeaderLayout>
        )
    }
}