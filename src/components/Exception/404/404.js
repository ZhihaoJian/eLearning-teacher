import React from 'react';
import Exception from 'ant-design-pro/lib/Exception';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    render() {
        const actions = (
            <div>
                <Button type="primary"><Link to='/classroom'>回到首页</Link></Button>
            </div>
        );
        return (
            <Exception type="404" actions={actions} />
        )
    }
}