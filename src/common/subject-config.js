import Loadable from 'react-loadable';
import React from 'react';
import { Spin, Icon } from 'antd';
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

//编辑题目 配置文件
export const subjectConfig = [
    {
        type: '判断题',
        component: () => import('../components/SubjectEdit/Judgment')
    },
    {
        type: '单选题',
        component: () => import('../components/SubjectEdit/SingleChoiceQuestion')
    },
    {
        type: '多选题',
        component: () => import('../components/SubjectEdit/MutipleChoice')
    }
]

export const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

//编辑题目编辑器通用配置
export const editorProps = {
    height: 100,
    width: '100%',
    contentFormat: 'html'
}


export function loadDynamicComponent(type) {
    const component = subjectConfig.filter(v => v.type === type)[0].component;
    return Loadable({
        loader: component,
        loading: () => (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} >
                <Spin indicator={antIcon} size='large' tip='加载中...' />
            </div>
        )
    });
}