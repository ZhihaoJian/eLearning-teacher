import React from 'react';
import { List, Card } from 'antd';
import { Link } from 'react-router-dom';
import './index.scss';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import PropTypes from 'prop-types';
const { Meta } = Card;

export default class CardList extends React.Component {

    /**
     * 渲染卡片参数
     */
    renderCard = item => {
        const url = `/classroom/room?name=${item.name}&roomid=${item.id}`;
        const cover = (
            <Link to={url}>
                <img alt="example" src={item.cover || `https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png`} />
            </Link>
        );
        const description = (
            <Ellipsis lines={1} tooltip={true} >
                {item.description}
            </Ellipsis>
        );
        const title = (
            <Link to={url}>
                <Ellipsis length={20} tooltip={true} >
                    {item.name}
                </Ellipsis>
            </Link >

        );
        return { cover, description, title, url }
    }

    render() {
        const { data, pagination, actions, loading } = this.props;
        return (
            <List
                size='small'
                loading={loading}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4 }}
                dataSource={data}
                pagination={pagination}
                renderItem={item => (
                    <List.Item className='card-list' >
                        {
                            <Card
                                loading={loading}
                                hoverable
                                className='card'
                                cover={this.renderCard(item).cover}
                                actions={actions(item)}
                            >
                                <Meta
                                    title={this.renderCard(item).title}
                                    description={this.renderCard(item).description}
                                />
                            </Card>
                        }
                    </List.Item>
                )}
            />
        )
    }
}

CardList.propTypes = {
    data: PropTypes.array.isRequired,
    pagination: PropTypes.object,
    actions: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    loading: PropTypes.bool
}

CardList.defaultProps = {
    data: [],
    pagination: {},
    actions: [],
    loading: false
}