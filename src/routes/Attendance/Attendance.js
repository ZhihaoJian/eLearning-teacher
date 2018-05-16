import React from "react";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

export default class Attendance extends React.Component {
    render() {
        return (
            <PageHeaderLayout
                title={'考勤'}
                content='班级人数  20人'
                breadcrumbList={this.props.breadcrumbList}
                action={(
                    <React.Fragment>
                        <ButtonGroup>
                            <Button type='primary' >新建考勤</Button>
                        </ButtonGroup>
                    </React.Fragment>
                )}
            >

            </PageHeaderLayout>
        )
    }
}