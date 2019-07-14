import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { observer } from 'mobx-react';
import apiMap from '@apiMap';
import { netModel, writeCookie, parseCookie } from 'xiaohuli-package';
import './index.scss';

const formItemLayout = {
    labelCol: {
        sm: { span: 6 },
        xs: {span: 6}
    },
    wrapperCol: {
        sm: { span: 12 },
        xs: { span: 12 }
    },
};

const FormItem = Form.Item;
@observer
class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
          if (!err) {
            if (values.password !== values.repassword) {
                message.error('两次密码输入不一致');
                return;
            }
            const res = await netModel.post(apiMap.get('addChatUser'), {
                userName: values.userName,
                passWord: values.password
            },{});
            if(res === 'add user success!') {
                writeCookie(values, 30);
                window.location.href='/home.html';
            } else {
                message.error('用户名已被占用')
            }
          }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('repassword', {
                        rules: [{ required: true, message: 'Please input your Password again !' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="rePassword" />
                    )}
                </Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Register
                </Button>
            </Form>
        )
    }
}

const WrappedLogin = Form.create({ name: 'normal_login' })(Login);
export default WrappedLogin;