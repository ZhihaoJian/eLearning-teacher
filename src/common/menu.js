export const ClassRoomMenuData = [
    {
        name: 'dashboard',
        icon: 'dashboard',
        path: '/classroom/room',
        children: [
            {
                name: '分析页',
                path: 'analysis',
            },
            {
                name: '监控页',
                path: 'monitor',
            },
            {
                name: '工作台',
                path: 'workplace',
            },
        ],
    },
    {
        name: '测评',
        icon: 'book',
        path: '/classroom/examination',
    },
    {
        name: '考勤',
        icon: 'pie-chart',
        path: '/classroom/attendance',
    },
    {
        name: '代码相似度检测',
        icon: 'code-o',
        path: '/similar-code-test'
    }
];


export const BasicMenuData = [
    {
        name: '班级列表',
        icon: 'user',
        path: '/classroom',
    },
    {
        name: '备课区',
        icon: 'book',
        path: '/prepare-course'
    }
]