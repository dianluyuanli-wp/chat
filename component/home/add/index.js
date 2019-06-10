import React from 'react';
import { Input, Form, Button, message } from 'antd';
import io from 'socket.io-client';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import { netModel } from 'xiaohuli-package';
import BaseCom from '../../baseStructure/baseCom';
import apiMap from '@apiMap';

const Search = Input.Search;

@inject('chatStore')
@observer
class add extends BaseCom {

    @action
    removeItemFromArray = (array, item) => {
        const rank = array.indexOf(item);
        if (rank !== -1) {
            array.splice(rank, 1);
        }
    }
    searchName = async (value) => {
        const ans = await netModel.get(apiMap.get('searchName'), {
            searchName: value
        }, {});
        runInAction(() => {
            this.store.searchList = ans;
        })
    }
    addFriend = async (name) => {
        const ans = await netModel.get(apiMap.get('addFriend'), {
            friendName: name
        }, {})
        if (ans === 'friend request success!') {
            message.success('请求发送成功');
        } else if (ans === 'already in list') {
            message.success('已在对方好友列表中');
        }
    }
    getList = () => {
        return this.store.searchList.map((item, index) => {
            return (
                <div className={'search-person'} key={index}>
                    <div>{item.userName}</div>
                    <Button type="primary" onClick={this.addFriend.bind(this, item.userName)}>Add</Button>
                </div>
            )
        })
    }
    agree = async (name) => {
        const ans = await netModel.get(apiMap.get('agreeFriendReq'), {
            friendName: name
        }, {})
        if (ans === 'have a new friend!') {
            message.success('已添加好友');
            this.removeItemFromArray(this.store.friendRequest, name);
        }
    }
    getReqList = () => {
        return this.store.friendRequest.map((item, index) => {
            return (
                <div key={index} className={'search-person'}>
                    <div>{item}</div>
                    <Button type='primary' onClick={this.agree.bind(this, item)}>I agree!</Button>
                </div>
            )
        })
    }
    render() {
        return (
            <div className={'add-container'}>
                <Search placeholder="input search text" onSearch={value => {this.searchName(value)}} enterButton></Search>
                <div className={'search-list'}>{this.getList()}</div>
                <div className={'friend-req-list'}>{this.getReqList()}</div>
            </div>
        )
    }
}

export default add;