import React from 'react';
import { Icon } from 'antd';

export const FooterLinks = [{
    key: '帮助',
    title: '帮助',
    href: '',
}, {
    key: 'github',
    title: <Icon type="github" />,
    href: 'https://github.com/ant-design/ant-design-pro',
    blankTarget: true,
}, {
    key: '条款',
    title: '条款',
    href: '',
    blankTarget: true,
}];

export const copyright = <div>Copyright <Icon type="copyright" /> eLearning 技术出品</div>;

