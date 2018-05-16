import React from 'react';
import { List, Card, Icon } from 'antd';
import { Link } from 'react-router-dom';
import './index.scss';
const { Meta } = Card;

export default ({ data, emptyCardTitle, action, type }) => (
    <List
        size='small'
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 6 }}
        dataSource={data}
        renderItem={item => (
            <List.Item className='card-list' >
                {
                    item.title === null ? (
                        <Card
                            hoverable
                            className='card add-new-card-container'
                        >
                            <div className='add-new-card' >
                                <Icon type="plus" /> {emptyCardTitle}
                            </div>
                        </Card>
                    ) : (
                            <Card
                                hoverable
                                className='card'
                                cover={(
                                    <Link to={item.navLink}>
                                        <img alt="example" src={item.cover} />
                                    </Link>
                                )}
                                actions={action}
                            >
                                <Meta
                                    title={(<Link to={item.navLink}>{item.title}</Link>)}
                                    description={item.description}
                                />
                            </Card>
                        )
                }
            </List.Item>
        )}
    />
)