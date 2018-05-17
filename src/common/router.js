import Loadable from 'react-loadable';
import React from 'react';
import { Spin, Icon, Menu } from 'antd';
import QueryString from '../utils/query-string';
import { BasicMenuData, ClassRoomMenuData } from '../common/menu';
import { NavLink } from 'react-router-dom';
const MenuItem = Menu.Item;

const routerConfig = {
    '/': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/ClassRoom/index')
    },
    '/classroom': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/ClassRoom/index')
    },
    '/classroom/room': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表',
                href: '/classroom',
            }, {
                title: 'dashboard'
            }
        ],
        menuData: ClassRoomMenuData,
        component: () => import('../routes/DashBoard/DashBoard')
    },
    '/classroom/examination': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表',
                href: '/classroom',
            }, {
                title: '测评'
            }
        ],
        addExamHref: '/classroom/examination/addExam',
        menuData: ClassRoomMenuData,
        component: () => import('../routes/Examination/index')
    },
    '/classroom/examination/examDetail': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表',
                href: '/classroom',
            }
        ],
        menuData: ClassRoomMenuData,
        component: () => import('../routes/Examination/detail')
    },
    '/classroom/examination/addExam': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            },
            {
                title: '测试',
                href: '/classroom/examination',
            }
            ,
            {
                title: '新建测试'
            }
        ],
        menuData: ClassRoomMenuData,
        component: () => import('../routes/AddExam/AddExam')
    },
    '/prepare-course': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '备课区'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/PrepareCourse/index')
    },
    '/prepare-course/add': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '备课区',
                href: '/prepare-course'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/PrepareCourse/AddNote')
    },
    '/prepare-course/edit': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '备课区',
                href: '/prepare-course'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/PrepareCourse/AddNote')
    },
    '/classroom/attendance': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '备课区'
            }
        ],
        menuData: ClassRoomMenuData,
        component: () => import('../routes/Attendance/Attendance')
    },
    '/similar-code-test': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '代码相似度检测'
            }
        ],
        menuData: ClassRoomMenuData,
        component: () => import('../routes/SimilarCode/SimilarCode')
    }
}

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


function formatUrl(path) {
    const length = path.length;
    if (path === '/') {
        return path;
    }
    if (path[length - 1] === '/') {
        path = path.slice(0, length - 1)
    } else if (path[0] !== '/') {
        path = `/${path}`
    }
    return path;
}

function getRouteParam(path) {
    return { ...QueryString.parse(path) };
}

function getDynamicComponent(path) {
    const formatedPath = formatUrl(path);
    return { ...routerConfig[formatedPath] }
}

function formatMenuData(menuData, routeParam) {
    return menuData.map((item, index) => {
        return (
            <MenuItem key={`${item.path}`} >
                <NavLink to={`${item.path + routeParam}`} >
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                </NavLink>
            </MenuItem>
        )
    })
}

export function loadDynamicComponent(location) {
    const path = location.pathname;
    const param = location.search;
    const routeParam = getRouteParam(param);

    const { component, menuData, breadcrumbList, ...restParam } = getDynamicComponent(path);
    const formatedMenuData = formatMenuData(menuData, param)

    const DynamicComponent = Loadable({
        loader: component,
        loading: () => (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} >
                <Spin indicator={antIcon} size='large' tip='加载中...' />
            </div>
        )
    });

    return { DynamicComponent, formatedMenuData, breadcrumbList, routeParam, ...restParam }
}
