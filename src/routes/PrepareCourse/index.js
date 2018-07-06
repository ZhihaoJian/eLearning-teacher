import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { withRouter, Link } from 'react-router-dom';
import { Button, Card, List, Popconfirm, message } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import AddNoteForm from './AddNoteForm';
import { loadCourseList, deleteCourse, addCourseInfo } from '../../service/AddExam.service';
import './index.scss';

const { Description } = DescriptionList;

@withRouter
export default class PrepareCourse extends React.Component {

    state = {
        loading: false,
        loadmore: false,
        visible: false,
        confirmLoading: false,
        courseList: [],
        cachedCourseList: [],
        tabActiveKey: "1"
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (pageSize = 10, current = 0) => {
        this.setState({ loading: true })
        loadCourseList(pageSize, current).then(res => {
            this.setState({
                cachedCourseList: res.content,
                courseList: res.content,
                loading: false
            })
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
                if (id) {
                    message.success('正在为您准备备课区, 请耐心等待!');
                    this.props.history.push(`/prepare-course/add?key=${id}`);
                }
                this.setState({ visible, confirmLoading: false });
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

    onTabChange = (tabActiveKey) => {
        const courseList = [...this.state.cachedCourseList]
        if (tabActiveKey === '2') {
            this.setState({
                tabActiveKey,
                courseList: courseList.filter(v => v.isRelease === 0)
            })
        } else if (tabActiveKey === '3') {
            this.setState({
                tabActiveKey,
                courseList: courseList.filter(v => v.isRelease === 1)
            })
        } else {
            this.setState({
                tabActiveKey,
                courseList: this.state.cachedCourseList
            })
        }
    }

    render() {
        const { tabActiveKey, cachedCourseList } = this.state;
        const tabList = [{
            key: '1',
            tab: '备课记录',
        }, {
            key: '2',
            tab: '未发布',
        },
        {
            key: '3',
            tab: '已发布',
        }];
        const description = (
            <DescriptionList size="small" col="3" layout="horizontal">
                <Description term="课程数量">{cachedCourseList.length}</Description>
                <Description term="已发布">{cachedCourseList.filter(v => v.isRelease === 1).length}</Description>
                <Description term="未发布">{cachedCourseList.filter(v => v.isRelease === 0).length}</Description>
            </DescriptionList>
        );

        return (
            <PageHeaderLayout
                title={'备课区'}
                tabList={tabList}
                tabActiveKey={tabActiveKey}
                breadcrumbList={this.props.breadcrumbList}
                content={description}
                onTabChange={key => this.onTabChange(key)}
                action={(
                    <Button
                        type='primary'
                        onClick={this.onAddCouseNote.bind(this)}
                    >新增备课</Button>
                )}
            >
                <Card
                    bordered={false}
                    className='prepare-course-container'
                >
                    <List
                        className="prepare-course-list"
                        loading={this.state.loading}
                        size='large'
                        itemLayout="vertical"
                        pagination={{ pageSize: 5 }}
                        loadMore={this.state.loadMore}
                        dataSource={this.state.courseList}
                        renderItem={item => (
                            <List.Item
                                extra={<img width={272} alt="cover" src={`/${item.coverURL}`} style={{ width: 200 }} />}
                                actions={
                                    [
                                        <Link to={`/prepare-course/edit?type=edit&key=${item.id}&name=${encodeURIComponent(item.name)}`}>编辑</Link>,
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
                                    title={<Link to={`/prepare-course/edit?key=${item.id}`}>{item.name}</Link>}
                                    description={(
                                        <React.Fragment>
                                            <div style={{ padding: '12px 0' }} >
                                                <div>{item.description}</div>
                                                <div style={{ marginTop: 10 }}>备注：{item.remark}</div>
                                                <div style={{ marginTop: 10 }} >标签：<a>{item.type || '无'}</a></div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                />
                                <div className='course-info'>
                                    发布状态：
                                    <a>{item.isRelease ? '已发布' : '未发布'}</a>
                                </div>
                                <div className='course-info' >
                                    修改时间：<span style={{ paddingLeft: 6 }} >{(new Date()).toLocaleDateString(item.createTime)}</span>
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