import React from 'react';
import Login from 'ant-design-pro/lib/Login';
import { Alert, Checkbox } from 'antd';
import Footer from '../../components/GlobalFooter/GlobalFooter';
import './index.scss';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

class LoginPage extends React.Component {
    state = {
        notice: '',
        type: 'tab2',
        autoLogin: true,
    }
    onSubmit = (err, values) => {
        console.log('value collected ->', { ...values, autoLogin: this.state.autoLogin });
        if (this.state.type === 'tab1') {
            this.setState({
                notice: '',
            }, () => {
                if (!err && (values.username !== 'admin' || values.password !== '888888')) {
                    setTimeout(() => {
                        this.setState({
                            notice: 'The combination of username and password is incorrect!',
                        });
                    }, 500);
                }
            });
        }
    }
    onTabChange = (key) => {
        this.setState({
            type: key,
        });
    }
    changeAutoLogin = (e) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    }
    render() {
        return (
            <div className='container'>
                <div className='login-page' >
                    <div className='logo-container' />
                    <Login
                        defaultActiveKey={this.state.type}
                        onTabChange={this.onTabChange}
                        onSubmit={this.onSubmit}
                    >
                        <Tab key="tab1" tab="账号">
                            {
                                this.state.notice &&
                                <Alert style={{ marginBottom: 24 }} message={this.state.notice} type="error" showIcon closable />
                            }
                            <UserName name="username" />
                            <Password name="password" />
                        </Tab>
                        <Tab key="tab2" tab="手机">
                            <Mobile name="mobile" />
                            <Captcha onGetCaptcha={() => console.log('Get captcha!')} name="captcha" />
                        </Tab>
                        <div>
                            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>记住我</Checkbox>
                            <a style={{ float: 'right' }} href="">忘记密码</a>
                        </div>
                        <Submit>登录</Submit>
                        <div>
                            其他登录方式
                         <span className="icon icon-alipay" />
                            <span className="icon icon-taobao" />
                            <span className="icon icon-weibo" />
                            <a style={{ float: 'right' }} href="">注册</a>
                        </div>
                    </Login>
                </div>
                <Footer />
            </div>
        );
    }
}

export default LoginPage;