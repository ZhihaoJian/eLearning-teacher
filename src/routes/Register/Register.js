import React from 'react';
import Footer from '../../components/GlobalFooter/GlobalFooter';
import { Form, Input, Col, Button, Radio, Alert } from 'antd';
import { Register, validateCaptcha } from '../../service/User.service';
import './index.scss';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

class RegisterPage extends React.Component {

    state = {
        captchaSuccess: false,   //用户是否输入正确的验证码,
        formIsValidate: true
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入密码不相同');
        } else {
            callback();
        }
    }

    onSubmit = () => {
        const { captchaSuccess } = this.state;
        const formData = this.props.form.getFieldsValue();
        const { email, password, confirmPwd } = formData;
        const role = [];
        role.push({ roleName: formData.role })
        formData.role = role;
        formData.username = formData.email;
        this.setState({ formIsValidate: true }, () => {
            if (email && password && confirmPwd && (password === confirmPwd) && captchaSuccess) {
                Register(formData).then(res => {
                    if (res && res.status === 0) {
                        window.location.href = '/classroom'
                    }
                });
            } else {
                this.setState({ formIsValidate: false })
            }
        })
    }

    /**
     * 点击切换验证码
     */
    switchCaptcha = (e) => {
        e.stopPropagation();
        const img = document.createElement('img');
        const that = e.currentTarget;
        img.onload = function () {
            that.innerHTML = '';
            that.appendChild(img);
        }
        img.src = '/authority/verifyCode';
    }

    /**
     * 验证码异步校验
     */
    validateCaptcha = (rule, value, callback) => {
        if (value) {
            setTimeout(() => {
                validateCaptcha(value).then(res => {
                    if (res) {
                        this.setState({ captchaSuccess: true })
                        callback();
                    } else {
                        this.setState({ captchaSuccess: false })
                        callback('验证码错误');
                    }
                })
            }, 500);
        } else {
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='container'>
                <div className='login-page' >
                    {
                        !this.state.formIsValidate ? (
                            <Alert
                                message="错误"
                                description="请检查表单字段是否填写完整或正确"
                                type="error"
                                closable
                            />
                        ) : null
                    }
                    <Form layout='horizontal' style={{ marginTop: 30 }} >
                        <FormItem label='注册'>
                            {
                                getFieldDecorator('email', {
                                    rules: [{
                                        required: true,
                                        message: '请输入邮箱'
                                    }, {
                                        type: 'email',
                                        message: '邮箱格式不合法'
                                    }]
                                })(
                                    <Input placeholder='邮箱' type='email' size='large' />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '请输入密码' }, {
                                            min: 6,
                                            message: '密码至少6位'
                                        }, {
                                            max: 16,
                                            message: '密码最大长度只能为16位'
                                        }]
                                })(
                                    <Input placeholder='6-16位密码，区分大小写' type='password' size='large' />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('confirmPwd', {
                                    rules: [
                                        { required: true, message: '请确认密码' },
                                        {
                                            validator: this.compareToFirstPassword
                                        }
                                    ]
                                })(
                                    <Input placeholder='确认密码' type='password' size='large' />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <InputGroup>
                                <Col span={17} >
                                    {
                                        getFieldDecorator('vrifyCode', {
                                            rules: [{
                                                required: true,
                                                message: '请输入验证码'
                                            }, {
                                                validator: this.validateCaptcha
                                            }]
                                        })(
                                            <Input placeholder='请输入验证码' size='large' />
                                        )
                                    }
                                </Col>
                                <Col span={7} >
                                    <div onClick={this.switchCaptcha} style={{ cursor: 'pointer' }} title='点击更换验证码' ><img src='/authority/verifyCode' alt='captcha' /> </div>
                                </Col>
                            </InputGroup>
                        </FormItem>
                        <FormItem label='请选择登录角色' >
                            {
                                getFieldDecorator('role', {
                                    rules: [{ required: true }],
                                    initialValue: 'STUDENT'
                                })(
                                    <RadioGroup onChange={this.onChange} size='large'>
                                        <Radio value={'STUDENT'}>学生</Radio>
                                        <Radio value={'TEACHER'}>老师</Radio>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <Col span={12}>
                                <Button style={{ width: '100%' }} size='large' type='primary' onClick={this.onSubmit} >注册</Button>
                            </Col>
                            <Col span={12}>
                                <a style={{ float: 'right' }} href='/signin' >使用已有账号登录</a>
                            </Col>
                        </FormItem>
                    </Form>
                </div>
                <Footer />
            </div >
        );
    }
}

export default RegisterPage = Form.create()(RegisterPage);