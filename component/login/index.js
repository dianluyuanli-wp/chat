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
            console.log('Received values of form: ', values);
            const res = await netModel.post(apiMap.get('chatVerify'), {
                userName: values.userName,
                passWord: values.password
            },{});
            if(res === 'verified') {
                writeCookie(values, 10);
                window.location.href='/home.html';
            } else {
                message.error('账号密码错误')
            }
            //console.log(res, 'answer');
          }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { userName, password } = parseCookie();
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                        initialValue: userName
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                        initialValue: password
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <a className={'login-register'} href='/register.html'>register new account</a>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
            </Form>
        )
    }
}

const WrappedLogin = Form.create({ name: 'normal_login' })(Login);
export default WrappedLogin;

//const mainName = this.store.$content[mainIndex].name;
