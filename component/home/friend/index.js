import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import { netModel } from 'xiaohuli-package';
import BaseCom from '../../baseStructure/baseCom';
import apiMap from '@apiMap';
import { getBothOwner, isFirst } from '@tools';
import { PAGE_NAME } from '@constants';

@inject('chatStore')
@observer
class Friend extends BaseCom {
    @action
    entryTalk = (item) => {
        this.store.pageKey = PAGE_NAME.TALK;
        this.store.toUserId = item;
    }
    getFriend = () => {
        return this.store.friendsList.map((item, index) => {
            const messageList = this.store.message.filter(target => target.bothOwner.includes(item));
            let message = '';
            let popUp = 0;
            if (messageList.length > 0) {
                const chatHistory = messageList[0].message;
                const { bothOwner, user1_flag, user2_flag } = messageList[0];
                popUp = isFirst(bothOwner, this.store.userName) ? (user2_flag - user1_flag) : (user1_flag - user2_flag);
                popUp = popUp > 99 ? '99+' : popUp;
                message = chatHistory[chatHistory.length - 1].content;
            }
            return (
                <div className={'friend-item'} key={index} onClick={this.entryTalk.bind(this, item)}>
                    <div className={'friend-icon'}>
                        {popUp > 0 && <div className={'friend-mes-info'}>{popUp}</div>}
                    </div>
                    <div className={'friend-content'}>
                        <div className={'friend-name'}>{item}</div>
                        <div className={'fri-say'}>{message}</div>
                    </div>
                </div>
            )
        })
    }
    render() {
        return (
            <div className={'friendList-wrapper'}>
                <div className={'fri-list-name'}>好友列表</div>
                <div>{this.getFriend()}</div>
            </div>
        )
    }
}

export default Friend;