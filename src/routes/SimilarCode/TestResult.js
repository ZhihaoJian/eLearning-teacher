import React from 'react';
import { Table, Progress, Card } from 'antd';
import './test-result.scss';

export default class TestResult extends React.Component {

    renderProgressBar = (data) => {
        const percent = Number.parseFloat((data * 100).toFixed(2), 10);
        if (data >= 0.75) {
            return <Progress percent={percent} size='small' status='exception' />
        } else if (data >= 0.5) {
            return <Progress percent={percent} size='small' status='active' />
        } else {
            return <Progress percent={percent} size='small' status='success' />
        }
    }

    expandedRowRender = ({ similarity_detail }) => {
        const keys = Object.keys(similarity_detail);
        const newData = keys.map((v, idx) => {
            const fnNames = v.replace(/\'|\(|\)|\s/gi, '').split(',');
            const similarRate = similarity_detail[keys[idx]];
            return {
                origin_fn: fnNames[0],
                match_fn: fnNames[1],
                similarRate: similarRate
            }
        })

        const columns = [
            {
                title: '原函数',
                dataIndex: 'origin_fn',
                key: 'origin_fn'
            },
            {
                title: '对比函数',
                dataIndex: 'match_fn',
                key: 'match_fn'
            },
            {
                title: '相似度',
                dataIndex: 'similarRate',
                key: 'similarRate',
                render: (text) => this.renderProgressBar(text),
            }
        ];

        return (
            <Table
                rowKey={record => record.origin_fn}
                columns={columns}
                dataSource={newData}
                pagination={false}
            />
        );
    };


    render() {

        const columns = [
            { title: '源文件', dataIndex: 'orgin_file_name', key: 'orgin_file_name', },
            { title: '对比文件', dataIndex: 'match_file_name', key: 'match_file_name', },
            {
                title: '相似度',
                dataIndex: 'average',
                key: 'average',
                render: (text) => this.renderProgressBar(text),
                sorter: true
            }
        ]


        return (
            <div className='test-result-container' >
                <Card bordered={false} >
                    <Table
                        rowKey={record => record.orgin_file_name}
                        columns={columns}
                        title={() => '检测结果'}
                        dataSource={this.props.dataSource}
                        expandedRowRender={this.expandedRowRender}
                        expandRowByClick={true}
                        pagination
                    />
                </Card>
            </div>
        )
    }
}