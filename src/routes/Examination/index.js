import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import QueryString from '../../utils/query-string';
import { withRouter, Link } from 'react-router-dom';
import { Card, List, Avatar } from 'antd';
import { Button } from 'antd';
import './index.scss';

const data = [
    {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('商业软件1班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 0
    },
    {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('商业软件2班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 1
    }
    , {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('商业软件3班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 1
    }, {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('数媒一班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 0
    }, {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('数媒二班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 1
    },
    {
        title: '幸福课的第一次测试',
        navLink: `/classroom/examination/examDetail?roomid=123&name=${encodeURIComponent('网工一班')}&examid=456&examName=${encodeURIComponent('幸福的第一次测试')}`,
        description: '请认真完成每一次测试，测试分数将计入平时成绩',
        status: 0
    }
]


@withRouter
export default class Examination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    render() {
        const title = QueryString.parse(this.props.location.search).name;
        const searchParam = this.props.location.search;
        return (
            <PageHeaderLayout
                title={title}
                breadcrumbList={this.props.breadcrumbList}
                action={(<Button type='primary'><Link to={this.props.addExamHref + searchParam} >新建测评</Link></Button>)}
            >
                <Card bordered={false} title='历史测评' >
                    <List
                        loadMore={false}
                        itemLayout='horizontal'
                        pagination
                        dataSource={data}
                        renderItem={item => (
                            <List.Item actions={[<Link to={`${item.navLink}&status=${item.status}`} >编辑</Link>, <a>删除</a>]} >
                                <List.Item.Meta
                                    avatar={item.status ? <Avatar src={require('../../assets/check.svg')} /> : <Avatar src={require('../../assets/minus.svg')} />}
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description={item.description}
                                />
                                <div className='item-container' >
                                    <div className='test-status' >
                                        <div className='test-status-details' >
                                            <div>已批</div>
                                            <div><a>15人</a></div>
                                        </div>
                                        <div className='test-status-details' >
                                            <div>未批</div>
                                            <div><a>15人</a></div>
                                        </div>
                                        <div className='test-status-details' >
                                            <div>未交</div>
                                            <div><a>15人</a></div>
                                        </div>
                                        <div className='test-status-details' >
                                            <div>最后修改时间</div>
                                            <div>2015/01/01</div>
                                        </div>
                                        <div className='test-status-details' >
                                            <div>发布状态</div>
                                            <div>{item.status ? '已发布' : '未发布'}</div>
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    >
                    </List>
                </Card>
            </PageHeaderLayout >
        )
    }
}