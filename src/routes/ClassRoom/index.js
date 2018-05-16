import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import CardList from '../../components/CardList/CardList';
import { classroomData } from '../../mock/data';

@withRouter
export default class ClassRoom extends React.Component {
    render() {
        return (
            <PageHeaderLayout
                title='班级列表'
                breadcrumbList={this.props.breadcrumbList}
                action={(<Button type='primary' >新建班级</Button>)}
            >
                <CardList data={classroomData} emptyCardTitle={'添加新班级'} />
            </PageHeaderLayout>
        )
    }
}