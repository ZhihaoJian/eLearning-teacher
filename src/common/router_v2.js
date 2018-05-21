import Loadable from 'react-loadable';
import React from 'react';
import { Spin, Icon, Menu } from 'antd';
import QueryString from '../utils/query-string';
import { BasicMenuData, ClassRoomMenuData } from '../common/menu';
import { NavLink } from 'react-router-dom';
const MenuItem = Menu.Item;

const routerConfig = {
    '': {
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
    'classroom': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '班级列表'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/ClassRoom/index'),
        childPath: {
            'room': {
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
            'examination': {
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
                component: () => import('../routes/Examination/index'),
                childPath: {
                    'examDetail': {
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
                    'addExam': {
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
                    }
                }
            },
            'attendance': {
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
            }
        }
    },
    'prepare-course': {
        breadcrumbList: [
            {
                title: '首页',
                href: '/classroom',
            }, {
                title: '备课区'
            }
        ],
        menuData: BasicMenuData,
        component: () => import('../routes/PrepareCourse/index'),
        childPath: {
            'add': {
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
            'edit': {
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
            }
        }
    },
    'similar-code-test': {
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


function getRouteParam(path) {
    return { ...QueryString.parse(path) };
}

//  1.  Assume path name is '/prepare-course/edit';
//  2.  Use  String.split('/')    >>>>     ['','prepare-course','edit'];
//  3.  To splice to first index in splited path array, we use  Array.splice(1)   >>>>   ['prepare-course','edit']
//  4.  Now the first index in splited pathname array is the entry point and the rest is the sub path;
//  5.  To get to entry path object  we use 'routerConfig[[the entry path]]'. To get rest path obj we can continue this way. 
//      If no match, default to empty string '',that the root of current path;
function getDynamicComponent(path) {
    let currentPathConfig = routerConfig;
    let parentPathConfig = null;
    let getComponent = false;
    const pathNamesArray = path.split('/').splice(1);
    for (let i = 0; i < pathNamesArray.length; i++) {
        parentPathConfig = currentPathConfig[pathNamesArray[i]];
        const currentPath = currentPathConfig[pathNamesArray[i]];
        const hasChildPath = currentPath.childPath ? true : false;
        currentPathConfig = hasChildPath ? currentPath.childPath : null;
        if (!currentPathConfig) {
            return { ...currentPath, selectedPath: `/${pathNamesArray[0]}` }
        }
    }
    if (!getComponent) {
        return { ...parentPathConfig, selectedPath: `/${pathNamesArray[0]}` };
    }
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
