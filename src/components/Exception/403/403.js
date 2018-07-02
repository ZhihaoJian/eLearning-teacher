import React from 'react';
import { Button } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import { Link } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    render() {
        const actions = (
            <div>
                <Button type="primary"><Link to='/signin'>去登录</Link></Button>
            </div>
        );
        return (
            <Exception 
                type="403" 
                actions={actions} 
                desc='您尚未登录，暂无权查看'
            />
        )
    }
}