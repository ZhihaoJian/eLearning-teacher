import React from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
// import { loadDynamicComponent } from '../../common/router';
import { loadDynamicComponent } from '../../common/router_v2';
import Footer from '../../components/GlobalFooter/GlobalFooter';
import GlobalHeader from '../../components/GlobalHeader/index';
import './BasicLayout.css';
import 'ant-design-pro/dist/ant-design-pro.css';

const { Sider, Content } = Layout;

class BasicLayout extends React.Component {

    state = {
        collapsed: false,
        DynamicComponent: null,
    };

    render() {
        const { location } = this.props;
        const { DynamicComponent, formatedMenuData, ...restProps } = loadDynamicComponent(location);
        return (
            <Layout id='basic-layout' >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        // selectedKeys={[restProps.selectedPath, this.props.location.pathname]}
                        selectedKeys={restProps.selectedKeys}
                    >
                        {formatedMenuData}
                    </Menu>
                </Sider>
                <Layout>
                    <GlobalHeader
                        collapsed={this.state.collapsed}
                        toggle={collapsed => this.setState({ collapsed })}
                    />
                    <Content style={{ margin: '24px 24px 0px', height: '100%' }}>
                        <DynamicComponent
                            {...restProps}
                        />
                    </Content>
                    <Footer />
                </Layout>
            </Layout >
        );
    }
}

export default BasicLayout = withRouter(BasicLayout);