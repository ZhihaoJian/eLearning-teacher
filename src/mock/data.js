import React from 'react';

export const examData = [
    {
        score: 1,
        questionContent: '在人的一生中，遇见知己是一件比较容易的事情。',
        questionAnalyseContent: '测试解析',
        answer: false,
        type: '判断题'
    },
    {
        score: 1,
        questionContent: '塞利格曼是(    )国心理学家，主要从事习得性无助、抑郁、乐观主义、悲观主义等方面的研究。',
        questionAnalyseContent: '测试解析',
        answer: {
            value: 1,
            optionList: [{
                value: 1, content: '美国'
            }, {
                value: 2, content: '英国'
            }, {
                value: 3, content: '法国'
            }, {
                value: 4, content: '德国'
            }]
        },
        type: '单选题'
    },
    {
        score: 10,
        questionContent: "你觉得大学是一个什么样的地方",
        questionAnalyseContent: '测试解析',
        answer: {
            checkedValues: [
                '学习的好地方'
            ],
            plainOptions: [
                '学习的好地方',
                '睡觉的地方',
                '泡妞的地方'
            ]
        },
        type: '多选题'
    }
]

export const prepareCourseData = [
    {
        title: '幸福课的第一次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (
            <div className='create-time'>
                <div>修改时间：2018</div>
                <div>发布人：JianZhihao</div>
            </div>
        )
    },
    {
        title: '幸福课的第二次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第三次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第四次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第五次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第六次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第七次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
    {
        title: '幸福课的第八次测试 - 备课',
        description: '幸福课的第一次测试',
        extra: (<div className='create-time'><div>修改时间：2018</div><div>发布人：JianZhihao</div></div>)

    },
]

export const treeData = [
    {
        key: '0-0',
        title: '第一周',
        children: [
            {
                key: '0-0-0',
                title: 'JavaScript简介',
                children: [
                    {
                        key: '0-0-0-0',
                        title: 'JavaScript简史',
                        children: [
                            {
                                key: '0-0-0-0-0',
                                title: '简介',
                                content: `JavaScript，一种高级编程语言，通过解释执行，是一门动态类型，面向对象（基于原型）的解释型语言[4]。它已经由ECMA（欧洲电脑制造商协会）通过ECMAScript实现语言的标准化[4]。它被世界上的绝大多数网站所使用，也被世界主流浏览器（Chrome、IE、Firefox、Safari、Opera）支持。JavaScript是一门基于原型、函数先行的语言[5]，是一门多范式的语言，它支持面向对象编程，命令式编程，以及函数式编程。它提供语法来操控文本、数组、日期以及正则表达式等，不支持I/O，比如网络、存储和图形等，但这些都可以由它的宿主环境提供支持。`
                            },
                            {
                                key: '0-0-0-0-1',
                                title: 'JavaScript的实现',
                                content: `虽然JavaScript与Java这门语言不管是在名字上，或是在语法上都有很多相似性，但这两门编程语言从设计之初就有很大的不同，JavaScript的语言设计主要受到了Self（一种基于原型的编程语言）和Scheme（一门函数式编程语言）的影响[5]。在语法结构上它又与C语言有很多相似（例如if条件语句、while循环、switch语句、do-while循环等）[6]。

                                在客户端，JavaScript在传统意义上被实现为一种解释语言，但在最近，它已经可以被即时编译（JIT）执行。随着最新的HTML5和CSS3语言标准的推行它还可用于游戏、桌面和移动应用程序的开发和在服务器端网络环境运行，如Node.js。`
                            }
                        ]
                    }
                ]

            }
        ]
    },
    {
        key: '0-1',
        title: '第二周',
        children: [
            {
                key: '0-1-0',
                title: '基本概念',
                children: [
                    {
                        key: '0-1-0-0',
                        title: '语法',
                        children: [
                            {
                                key: '0-1-0-0-0',
                                title: '区分大小写'
                            },
                            {
                                key: '0-1-0-0-1',
                                title: '区分标识符'
                            }
                        ]
                    },
                    {
                        key: '0-1-0-1',
                        title: '变量'
                    }
                ]
            }
        ]
    },
    {
        key: '0-2',
        title: '第三周',
        children: [
            {
                key: '0-2-0',
                title: '变量、作用域和内存问题',
                children: [
                    {
                        key: '0-2-0-0',
                        title: '基本类型和引用类型的值',
                        children: [
                            { title: '动态的属性', key: '0-2-0-0-0' },
                            { title: '复制变量值', key: '0-2-0-0-1' }
                        ]
                    }
                ]
            },
            {
                key: '0-2-1',
                title: 'leaf'
            }
        ]
    },
    {
        key: '0-3',
        title: '第四周',
        children: [
            {
                key: '0-3-0',
                title: '引用类型',
                children: [
                    { key: '0-3-0-0', title: 'Object类型' },
                    { key: '0-3-0-1', title: 'Array类型' }
                ]
            }
        ]
    }
]


export const classroomData = [
    {
        name: '商业软件1班',
        navLink: '/classroom/room?roomid=123&name=商业软件1班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    },
    {
        name: '商业软件2班',
        navLink: '/classroom/room?roomid=123&name=商业软件2班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }
    , {
        name: '商业软件3班',
        navLink: '/classroom/room?roomid=123&name=商业软件3班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '数媒一班',
        navLink: '/classroom/room?roomid=123&name=数媒一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '数媒二班',
        navLink: '/classroom/room?roomid=123&name=数媒二班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    },
    {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    },
    {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    },
    {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }, {
        name: '网工一班',
        navLink: '/classroom/room?roomid=123&name=网工一班',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        description: 'This is the description'
    }
]