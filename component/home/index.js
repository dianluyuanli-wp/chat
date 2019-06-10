import React, {Component} from 'react';
import { Input, Form, Button } from 'antd';
import io from 'socket.io-client';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import { netModel, parseCookie } from 'xiaohuli-package';
import BaseCom from '../baseStructure/baseCom';
import apiMap from '@apiMap';
import { getBothOwner, isFirst } from '@tools';
import Chat from './chats';
import Add from './add';
import Me from './me';
import Friend from './friend';
import { PAGE_NAME } from '@constants';

@inject('chatStore')
@observer
class HomePage extends BaseCom {
    componentDidMount() {
        runInAction(() => {
            this.store.socketIoObj = io('http://localhost:3000');
        })

        //  接受消息监听
        this.store.socketIoObj.on('chat message', (msg) => {
            runInAction(() => {
                const { owner, message } = msg;
                const messageList = this.getChatList(owner);
                if (messageList.length > 0) {
                    messageList[0].message.push(this.createMessage(owner, message))
                } else {
                    this.initMessage(owner, this.store.userName, message);
                }
            })
            if (this.store.pageKey === PAGE_NAME.TALK) {
                this.updateMesRank();
            } else {
                this.rankMark('reveiver', msg.owner);
            }
        });
        this.store.socketIoObj.emit('register', this.store.userName);
    }
    @action
    changeTab = (index) => {
        this.store.pageKey = index;
    }
    getTab = () => {
        const array = ['friends', 'contats', 'me'];
        return (
            <div className='bottom-tab'>
                {array.map((item, index) => {
                    return (
                        <div className={'bottom-item' + (this.store.pageKey === index ? ' item-focus' : '')} key={index} onClick={this.changeTab.bind(this, index)}>
                            {item}
                        </div>
                    )
                })}
            </div>
        )
    }
    render() {
        const renderMap = {
            0 : <Friend />,
            1 : <Add />,
            2 : <Me />,
            3 : <Chat />
        }
        return (
            <div className='main-container'>
                {renderMap[this.store.pageKey]}
                {[PAGE_NAME.FRIENDS, PAGE_NAME.ADD, PAGE_NAME.ME].includes(this.store.pageKey) && this.getTab()}
            </div>
        )
    }
}

export default HomePage;