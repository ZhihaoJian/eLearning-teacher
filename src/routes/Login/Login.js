import React from 'react';
import Login from 'ant-design-pro/lib/Login';
import { Alert, Checkbox, Icon } from 'antd';
import Footer from '../../components/GlobalFooter/GlobalFooter';
import './index.scss';
import { UserLogin } from '../../service/User.service';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

class LoginPage extends React.Component {
    state = {
        notice: '',
        type: 'tab1',
        autoLogin: true,
    }

    onSubmit = (err, values) => {
        const { type } = this.state;
        if (type === 'tab1') {
            this.setState({
                notice: '',
            }, () => {
                if (!err && values.username && values.password) {
                    UserLogin(values).then(res => {
                        if (res) {
                            window.location.href = '/classroom';
                        }
                    })
                } else {
                    this.setState({ notice: '请检查账号与密码是否正确' })
                }
            });
        } else {
            //TODO 
            //手机登录
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
                            <UserName name="username" rules={[{ required: true, message: '请输入账号或邮箱' }]} placeholder='用户名 / 邮箱账号' />
                            <Password name="password" rules={[{ required: true, message: '请输入密码' }]} placeholder='密码' />
                        </Tab>
                        <Tab key="tab2" tab="手机">
                            <Mobile name="mobile" placeholder='手机号码' />
                            <Captcha placeholder='验证码' onGetCaptcha={() => console.log('Get captcha!')} name="captcha" />
                        </Tab>
                        <div>
                            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>记住我</Checkbox>
                            <a style={{ float: 'right' }} href="">忘记密码</a>
                        </div>
                        <Submit>登录</Submit>
                        <div>
                            {/* 其他登录方式
                            <Icon type="weibo" style={{ fontSize: 20 }} />
                            <Icon type="wechat" style={{ fontSize: 20 }} />
                            <Icon type="google" style={{ fontSize: 20 }} /> */}
                            <a style={{ float: 'right' }} href="/register">注册</a>
                        </div>
                    </Login>
                </div>
                <Footer />
            </div>
        );
    }
}

export default LoginPage;