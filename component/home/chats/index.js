import React from 'react';
import { Input, Form, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action, autorun, observable } from 'mobx';
import './index.scss';
import BaseCom from '../../baseStructure/baseCom';
import { getBothOwner, isFirst, getBgUrl, wrapedReq } from '@tools';
import Loading from '@UI/loading';
import { Header } from '@UI';
import { FRIENDS, FRIENDINFO } from '@constants';

const { TextArea } = Input;

@inject('chatStore')
@observer
class HomePage extends BaseCom {
    messageList = this.getChatList(this.store.toUserId);
    @observable scrollLock = false;
    componentDidMount = async () => {
        this.updateMesRank();
        this.box = document.getElementsByClassName('chat-box')[0];
        this.boxScroll();
        autorun(() => {
            const b = this.messageList[0]?.message || [];
            if (b.length > 0) {
                setTimeout(this.boxScroll, 0);  //  保证输入新内容的时候会拉到最底
            }
        })

        let obsInter = new IntersectionObserver(async (item) => {
            if (item[0].intersectionRatio <= 0) {
                return;
            }
            const messObj = this.messageList[0] || '';
            let reqLength = 15;
            if (messObj && messObj.message.length > 0) {
                const { user1_flag, user2_flag, message } = messObj;
                const diff = Math.max(user1_flag, user2_flag) - message.length;
                if (diff <= 0) {
                    return ;
                }
                reqLength = diff > 15 ? 15 : diff;
            } else {
                return ;
            }
            this.scrollLock = true;
            const ans = await wrapedReq.get('getMoreMessage', {
                currentLength: this.messageList[0].message.length,
                toFriend: this.store.toUserId,
                length: reqLength
            }, {});
            runInAction(() => {
                this.messageList[0].message = ans.message.concat(toJS(this.messageList[0].message));
            })
            setTimeout(() => {this.scrollLock = false}, 0);
        })
        obsInter.observe(document.getElementById('chat-mess-observer'));
    }

    //  滚动条置底
    boxScroll = () => {
        !this.scrollLock && this.box.scrollTo(0, this.box.scrollHeight);
    }

    //  发送消息
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
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
            //  重新校验一次
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
        const returnList = renderList.reverse().map((item, index) => {
            const isOwner = this.store.userName === item.owner;
            const avatar = <div className={'user-avatar'} style={{backgroundImage: getBgUrl(this.getAvatar(item.owner)) }} 
                />;
            const content = <div className={'user-say'}>{item.content}</div>;
            return (
                <div key={index} className={'word-box ' + (isOwner ? 'right-box' : 'left-box')}>
                    {isOwner ? content : avatar}{isOwner ? avatar : content}
                </div>
            )
        });
        returnList.push(<div key={'0_0'} id='chat-mess-observer'>
            {this.scrollLock ? Loading() : '1'}
        </div>);
        return returnList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Header midContent={this.getFriendInfo(this.store.toUserId).nickName || this.store.toUserId} back={this.changePage.bind(this, FRIENDS)}>
                    <div className={'chat-top-more'} onClick={this.changePage.bind(this, FRIENDINFO)}>. . .</div>
                </Header>
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