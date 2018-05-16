import React from 'react';
import QueryString from '../../utils/query-string';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import './index.scss';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
const { Meta } = Card;

@withRouter
export default class DashBoard extends React.Component {

    state = {
        loading: true
    }

    componentDidMount() {
        const roomid = QueryString.parse(this.props.location.search).roomid;
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000);
    }

    render() {
        // 数据源
        const data = [
            { genre: 'Sports', sold: 275, income: 2300 },
            { genre: 'Strategy', sold: 115, income: 667 },
            { genre: 'Action', sold: 120, income: 982 },
            { genre: 'Shooter', sold: 350, income: 5271 },
            { genre: 'Other', sold: 150, income: 3710 }
        ];

        // 定义度量
        const cols = {
            sold: { alias: '销售量' },
            genre: { alias: '游戏种类' }
        };

        const title = QueryString.parse(this.props.location.search).name;

        return (
            <PageHeaderLayout title={title} breadcrumbList={this.props.breadcrumbList} >
                <Row>
                    <Col span={6} className='chart-card-col' >
                        <Spin spinning={this.state.loading}>
                            <Card className='chart-card'>
                                <Meta
                                    title="总访问量"
                                    className='chart-card-meta'
                                />
                                <div className='card-chart-number' >1000</div>
                                <Chart width={300} data={data} scale={cols}>
                                    <Axis name="genre" />
                                    <Axis name="sold" />

                                    <Tooltip />
                                    <Geom type="interval" position="genre*sold" color="genre" />
                                </Chart>
                            </Card>
                        </Spin>
                    </Col>
                    <Col span={6} className='chart-card-col' >
                        <Spin spinning={this.state.loading} >
                            <Card className='chart-card' >
                                <Meta
                                    title="总访问量"
                                    className='chart-card-meta'
                                />
                                <div className='card-chart-number' >1000</div>
                                <Chart width={300} data={data} scale={cols}>
                                    <Axis name="genre" />
                                    <Axis name="sold" />

                                    <Tooltip />
                                    <Geom type="interval" position="genre*sold" color="genre" />
                                </Chart>
                            </Card>
                        </Spin>
                    </Col>
                    <Col span={6} className='chart-card-col' >
                        <Spin spinning={this.state.loading} >
                            <Card className='chart-card' >
                                <Meta
                                    title="总访问量"
                                    className='chart-card-meta'
                                />
                                <div className='card-chart-number' >1000</div>
                                <Chart width={300} data={data} scale={cols}>
                                    <Axis name="genre" />
                                    <Axis name="sold" />

                                    <Tooltip />
                                    <Geom type="interval" position="genre*sold" color="genre" />
                                </Chart>
                            </Card>
                        </Spin>
                    </Col>
                    <Col span={6} className='chart-card-col' >
                        <Spin spinning={this.state.loading} >
                            <Card className='chart-card' >
                                <Meta
                                    title="总访问量"
                                    className='chart-card-meta'
                                />
                                <div className='card-chart-number' >1000</div>
                                <Chart width={300} data={data} scale={cols}>
                                    <Axis name="genre" />
                                    <Axis name="sold" />

                                    <Tooltip />
                                    <Geom type="interval" position="genre*sold" color="genre" />
                                </Chart>
                            </Card>
                        </Spin>
                    </Col>
                </Row>
            </PageHeaderLayout >
        )
    }
}
