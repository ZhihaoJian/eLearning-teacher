import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { withRouter, Link } from 'react-router-dom';
import { Button, Card, List, Popconfirm, message } from 'antd';
import AddNoteForm from './AddNoteForm';
import { loadCourseList, deleteCourse, addCourseInfo } from '../../service/AddExam.service';
import './index.scss';

@withRouter
export default class PrepareCourse extends React.Component {

    state = {
        loading: false,
        loadmore: false,
        visible: false,
        confirmLoading: false,
        courseList: []
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (pageSize = 10, current = 0) => {
        loadCourseList(pageSize, current).then(res => {
            this.setState({ courseList: res.content })
        })
    }

    onAddCouseNote() {
        this.setState({ visible: true })
    }

    onOk = (formData) => {
        const { visible, data } = formData;
        this.setState({
            confirmLoading: true
        }, () => {
            addCourseInfo(data).then(id => {
                message.success('正在为您准备备课区, 请耐心等待!');
                this.setState({ visible, confirmLoading: false })
                this.props.history.push(`/prepare-course/add?id=${id}`);
            })
        })
    }

    onDeleteCourse = (id) => {
        deleteCourse(id).then(() => {
            message.success('删除成功!');
            this.fetchData();
        })
    }

    onCancel = visible => {
        this.setState(visible)
    }

    render() {
        return (
            <PageHeaderLayout
                title={'备课区'}
                breadcrumbList={this.props.breadcrumbList}
                action={(
                    <Button
                        type='primary'
                        onClick={this.onAddCouseNote.bind(this)}
                    >新增备课</Button>
                )}
            >
                <Card
                    title='备课记录'
                    bordered={false}
                    className='prepare-course-container'
                >
                    <List
                        className="prepare-course-list"
                        loading={this.props.loading}
                        size='large'
                        itemLayout="horizontal"
                        pagination={{ pageSize: 5 }}
                        loadMore={this.state.loadMore}
                        dataSource={this.state.courseList}
                        renderItem={item => (
                            <List.Item
                                actions={
                                    [
                                        <Link to={`/prepare-course/edit?id=${item.id}&name=${encodeURIComponent(item.name)}`}>编辑</Link>,
                                        <Popconfirm
                                            title='确认要删除改备课信息?'
                                            onConfirm={() => this.onDeleteCourse(item.id)}
                                            placement='right'
                                        >
                                            <a>删除</a>
                                        </Popconfirm>
                                    ]
                                }
                            >
                                <List.Item.Meta
                                    title={<Link to={`/prepare-course/edit?id=${item.id}`}>{item.name}</Link>}
                                    description={(
                                        <React.Fragment>
                                            <div style={{ padding: '12px 0' }} >
                                                <div>{item.description}</div>
                                                <div style={{ marginTop: 10 }}>备注：{item.remark}</div>
                                                <div style={{ marginTop: 10 }} >标签：<a>{item.type}</a></div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                />
                                <div className='course-info'>
                                    <div>发布状态</div>
                                    <div style={{ padding: '6px 0' }}><a>{item.isRelease ? '已发布' : '未发布'}</a></div>
                                </div>
                                <div className='course-info'>
                                    <div>修改时间</div>
                                    <div style={{ padding: '6px 0' }}>{(new Date()).toLocaleDateString(item.createTime)}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <AddNoteForm
                        visible={this.state.visible}
                        confirmLoading={this.state.confirmLoading}
                        onOk={data => this.onOk(data)}
                        onCancel={visible => this.onCancel(visible)}
                    />
                </Card>
            </PageHeaderLayout>
        )
    }
}