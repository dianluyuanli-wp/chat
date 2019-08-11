import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import BaseCom from '../../baseStructure/baseCom';
import { getBothOwner, isFirst, getBgUrl } from '@tools';
import { CHAT } from '@constants';
import { Header } from '@UI';
//import Test from './testCom';
@inject('chatStore')
@observer
class Friend extends BaseCom {
    @action
    entryTalk = (item) => {
        this.store.pageKey = CHAT;
        this.store.toUserId = item;
    }
    getFriend = () => {
        let popUpMark = 0;
        const list = this.store.friendsList.map((item, index) => {
            const messageList = this.store.message.filter(target => target.bothOwner.includes(item.userName));
            let message = '';
            let popUp = 0;
            if (messageList.length > 0) {
                const chatHistory = messageList[0].message;
                const { bothOwner, user1_flag, user2_flag } = messageList[0];
                popUp = isFirst(bothOwner, this.store.userName) ? (user2_flag - user1_flag) : (user1_flag - user2_flag);
                popUp = popUp > 99 ? '99+' : popUp;
                message = chatHistory[chatHistory.length - 1].content;
                popUpMark += popUp;
            }
            return (
                <div className={'friend-item'} key={index} onClick={this.entryTalk.bind(this, item.userName)}>
                    <div className={'friend-icon'} style={{ backgroundImage: getBgUrl(this.getAvatar(item.userName))}}>
                        {popUp > 0 && <div className={'friend-mes-info'}>{popUp}</div>}
                    </div>
                    <div className={'friend-content'}>
                        <div className={'friend-name'}>{item.nickName}</div>
                        <div className={'fri-say'}>{message}</div>
                    </div>
                </div>
            )
        })
        runInAction(() => {
            this.store.allPopUp = popUpMark; 
        })
        return list;
    }
    render() {
        return (
            <div className={'friendList-wrapper'}>
                <Header noBack={true} midContent={'IChat'}/>
                <div className={'fri-list-name'}>好友列表</div>
                <div>{this.getFriend()}</div>
            </div>
        )
    }
}

export default Friend;