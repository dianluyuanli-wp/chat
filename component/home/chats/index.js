import React from 'react';
import { Input, Form, Button } from 'antd';
import io from 'socket.io-client';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action, autorun } from 'mobx';
import './index.scss';
import { netModel } from 'xiaohuli-package';
import BaseCom from '../../baseStructure/baseCom';
import apiMap from '@apiMap';
import { getBothOwner, isFirst } from '@tools';
import { PAGE_NAME } from '@constants';

const { TextArea } = Input;

@inject('chatStore')
@observer
class HomePage extends BaseCom {
    componentDidMount = async () => {
        this.updateMesRank();
        this.box = document.getElementsByClassName('chat-box')[0];
        this.boxScroll();
        autorun(() => {
            const b = this.getChatList(this.store.toUserId)[0].message;
            if (b.length > 0) {
                setTimeout(this.boxScroll, 0);
            } 
        })

        let obsInter = new IntersectionObserver((item) => {
            console.log('visibility change');
        })

        obsInter.observe(document.getElementById('chat-mess-observer'));
    }
    messageList = this.getChatList(this.store.toUserId);
    //  滚动条置底
    boxScroll = () => {
        //
        this.box.scrollTo(0, this.box.scrollHeight);
    }

    //  发送消息
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
        //   if (!err) {
        //     console.log(values, 'value');
        //   }
            if (!values.message) {
                return ;
            }
            if (this.messageList.length > 0) {
                runInAction(() => {
                    this.messageList[0].message.push(this.createMessage(this.store.userName, values.message));
                })
            } else {
                this.initMessage(this.store.userID, this.store.toUserId, values.message);
            }
            this.rankMark('sender', this.store.toUserId);
            this.store.socketIoObj.emit('chat message', this.store.toUserId, this.store.userName, values.message);
            this.props.form.resetFields();
        });
    }
    getMessage = () => {
        let renderList = this.messageList;
        if (renderList.length > 0) {
            renderList = renderList[0].message;
        } else {
            renderList = [];
        }
        const returnList = renderList.map((item, index) => {
            const isOwner = this.store.userName === item.owner;
            const avatar = <div className={'user-avatar'}>{item.owner}</div>;
            const content = <div className={'user-say'}>{item.content}</div>;
            return (
                <div key={index} className={'word-box ' + (isOwner ? 'right-box' : 'left-box')}>
                    {isOwner ? content : avatar}{isOwner ? avatar : content}
                </div>
            )
        });
        returnList.unshift(<div key={'0_0'} id='chat-mess-observer'></div>);
        return returnList;
    }
    @action
    backToHome = () => {
        this.store.pageKey = PAGE_NAME.FRIENDS;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className={'chat-top'}>
                    <div className={'chat-top-back'} onClick={this.backToHome}>{'<'}</div>
                    <div className={'chat-top-friend'} onClick={() => {console.log(toJS(this.store))}}>{this.store.toUserId}</div>
                    <div className={'chat-top-more'}>. . .</div>
                </div>
                <div className={'chat-box-wrapper'}>
                    <div className={'chat-box'}>{this.getMessage()}</div>
                </div>
                <Form onSubmit={this.handleSubmit} className="chat-form">
                    <Form.Item className={'chat-text-input'}>
                        {getFieldDecorator('message', {
                            rules: [{ required: true, message: 'empty message!' }],
                            initialValue: ''
                        })(
                            <TextArea className={'chat-text'} autosize={{ minRows: 1, maxRows: 6 }} placeholder="put something in!" />
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="chat-send">
                        Send
                    </Button>
                </Form>
            </div>
        )
    }
}
const HomePageD = Form.create({ name: 'normal_login' })(HomePage);
export default HomePageD;