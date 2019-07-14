import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, action } from 'mobx';
import './index.scss';
import BaseCom from '../../baseStructure/baseCom';
import { wrapedReq, userInList } from '@tools';
import { Header, Profile } from '@UI';

const Search = Input.Search;

@inject('chatStore')
@observer
class add extends BaseCom {

    @action
    removeItemFromArray = (array, item) => {
        const rank = array.findIndex(sitem => sitem.userName === item);
        if (rank !== -1) {
            array.splice(rank, 1);
        }
    }

    searchName = async (value) => {
        if (!value) {
            return;
        }
        if (value === this.store.userName) {
            message.error('不能添加自己');
            return ;
        }
        const ans = await wrapedReq.get('searchName', {searchName: value}, {});
        runInAction(() => {
            this.store.searchList = ans === 'not found' ? [] : ans;
        })
    }
    addFriend = async (name) => {
        const ans = await wrapedReq.get('addFriend', {
            friendName: name
        }, {})
        if (ans === 'friend request success!') {
            message.success('请求发送成功');
            this.store.socketIoObj.emit('informFriend', { type: 'addReq', friendName: name, IAm: this.store.userName });
        } else if (ans === 'A friend request has been sent') {
            message.error('好友请求已发送，请勿重复发送');
        }
    }
    getList = (prop) => {
        const isSearch = prop === 'search';
        const targetList = isSearch ? this.store.searchList : this.store.friendRequest;
        return targetList.map((item, index) => {
            const isMyFriend = userInList(this.store.friendsList, item) && userInList(item.friendsList, {userName: this.store.userName});
            const buttonContent = isSearch ? (isMyFriend ? 'Added' : 'Add') : 'Agree';
            return (
                <div className={'search-person'} key={index}>
                    <Button type="primary" disabled={isSearch ? isMyFriend : false} className={'add-button'} onClick={isSearch ? this.addFriend.bind(this, item.userName) : this.agree.bind(this, item)}>{buttonContent}</Button>
                    {!isSearch && <Button type='dashed' onClick={() => this.ignore(item.userName)} className='delete-friReq'>Ignore</Button>}
                    <Profile info={item}/>
                </div>
            )
        })
    }

    ignore = async (name) => {
        //  忽略好友请求
        const ans = await wrapedReq.post('updateUserInfo', {changeObj: {delete: { value: name, key: 'friendRequest' }}}, {});
        runInAction(() => {
            const rank = this.store.friendRequest.findIndex(item => item.userName === name);
            this.store.friendRequest.splice(rank, 1);
        })
    }

    agree = async (item) => {
        const name = item.userName;
        const ans = await wrapedReq.get('agreeFriendReq', {
            friendName: name
        }, {})
        if (ans === 'have a new friend!') {
            message.success('已添加好友');
            this.store.socketIoObj.emit('informFriend', { type: 'agreeReq', friendName: name, IAm: this.store.userName });
            runInAction(() => {
                if (!userInList(this.store.friendsList, item)) {
                    this.store.friendsList.push(item)
                }
            })
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
                <Header noBack={true} midContent={'Contats'}/>
                <Search placeholder="search chatID to add new friend!" style={{ marginTop: '.1rem' }} onSearch={value => {this.searchName(value)}} enterButton></Search>
                <div className={'search-list'}>{this.getList('search')}</div>
                <div className={'search-list'}>{this.getList('addReq')}</div>
                {/* <div className={'friend-req-list'}>{this.getReqList()}</div> */}
            </div>
        )
    }
}

export default add;