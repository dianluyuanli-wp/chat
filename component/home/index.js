import React, {Component} from 'react';
import { Input, Form, Button, message as Message } from 'antd';
import io from 'socket.io-client';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import BaseCom from '../baseStructure/baseCom';
import Chat from './chats';
import Add from './add';
import Me from './me';
import Friend from './friend';
import { userInList } from '@tools';
import FriendInfo from './friendInfo';
import { FRIENDS, ADD, ME, CHAT, PAGE_NAME, NOT_YOUR_FRIEND, NEW_FRIEND_REQ, REQ_AGREE } from '@constants';

@inject('chatStore')
@observer
class HomePage extends BaseCom {
    componentDidMount() {
        //  全局绑个用户名
        window.chatUserName = this.store.userName;
        let protocal = window.location.protocol;
        runInAction(() => {
            const socketUrl = (process.env.NODE_ENV === 'production' || apiFromLocal.PLACE === 'remote') ? protocal + '//tangshisanbaishou.xyz' : 'http://localhost:3000';
            //const socketUrl = 'http://149.129.83.246';
            this.store.socketIoObj = io(socketUrl, {
                path: '/mySocket'
            });
        })

        //  接受消息监听
        this.store.socketIoObj.on('chat message', (msg) => {
            const { owner, message } = msg;
            runInAction(() => {
                //  收到消息的话实时更新谈话列表
                const messageList = this.getChatList(owner);
                if (messageList.length > 0) {
                    messageList[0].message.push(this.createMessage(owner, message))
                } else {
                    this.initMessage(owner, this.store.userName, message);
                }
            })
            //  收到消息时，跟踪消息记录
            if (this.store.pageKey === CHAT) {
                //  如果在聊天页，直接同步消息rank
                this.updateMesRank();
            } else {
                //  如果不在聊天页，同步更新气泡
                this.rankMark('reveiver', msg.owner);
            }
        });

        //  系统通知，好友申请、消息拦截等等
        this.store.socketIoObj.on('system notification', (msg) => {
            const { type, message } = msg;
            const notificationMap = {
                NOT_YOUR_FRIEND: () => Message.error('对方开启好友验证，本消息无法送达'),
                NEW_FRIEND_REQ: () => runInAction(() => {
                    this.store.friendRequest.push(message);
                }),
                REQ_AGREE: () => {
                    if (!userInList(this.store.friendsList, message)) {
                        runInAction(() => {
                            this.store.friendsList.push(message);
                        })
                    }
                }
            }
            notificationMap[type]();
        })
        this.store.socketIoObj.emit('register', this.store.userName);
    }

    getTab = () => {
        const array = ['friends', 'contats', 'me'];
        return (
            <div className='bottom-tab'>
                {array.map((item, index) => {
                    const isRedPoint = item === 'contats' && this.store.friendRequest.length > 0;
                    return (
                        <div className={'bottom-item' + (this.store.pageKey === PAGE_NAME[index] ? ' item-focus' : '') + (isRedPoint ? ' new-friend-req' : '')} key={index} onClick={this.changePage.bind(this, PAGE_NAME[index])}>
                            {item}
                        </div>
                    )
                })}
            </div>
        )
    }
    render() {
        const renderMap = {
            FRIENDS : <Friend />,
            ADD : <Add />,
            ME : <Me />,
            CHAT : <Chat />,
            FRIENDINFO : <FriendInfo />
        }
        return (
            <div className='main-container'>
                {renderMap[this.store.pageKey]}
                {[FRIENDS, ADD, ME].includes(this.store.pageKey) && this.getTab()}
            </div>
        )
    }
}

export default HomePage;