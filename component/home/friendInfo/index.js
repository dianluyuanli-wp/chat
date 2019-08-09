import React from 'react';
import { Input, Form, Modal, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, observable, action } from 'mobx';
import s from './index.css';
import { getBgUrl, combineCss, wrapedReq } from '@tools';
import BaseCom from '../../baseStructure/baseCom';
import { Profile, Header } from '@UI';
import { CHAT, FRIENDS } from '@constants';

import { init, callNative} from '@tools/jsBridge';

@inject('chatStore')
@observer
class FriendInfo extends BaseCom {
    @observable status = 'profile';
    @observable newFriendNickName = '';
    @observable showDialog = false;

    @action
    clickChange = (value) => {
        if (value === 'Delete friend') {
            this.showDialog = true;
        } else {
            this.status = value;
        }
    }

    @action
    changeTransmisValue = (props, event) => {
        this[props] = event.target.value;
    }

    save = async () => {
        if (!this.isHighLight()) {
            return ;
        }
        const ans = await wrapedReq.post('updateUserInfo', {changeObj: { fridendNickName: { newNickName: this.newFriendNickName, friend: this.store.toUserId }}}, {});
        if (ans === 'success') {
            message.success('保存成功');
            runInAction(() => {
                this.store.friendsList.filter(item => item.userName === this.store.toUserId)[0].nickName = this.newFriendNickName;
            })
        }
    }

    isHighLight = () => this.newFriendNickName !== this.getFriendInfo(this.store.toUserId).nickName;

    handleOk = async () => {
        //  删除好友
        await wrapedReq.post('updateUserInfo', {changeObj: { delete: { key: 'friendsList', value: this.store.toUserId} }}, {});
        runInAction(() => {
            const rank = this.store.friendsList.findIndex(item => item.userName === this.store.toUserId);
            this.store.friendsList.splice(rank, 1);
        })
        this.handleCancel();
        this.changePage(FRIENDS);
    }

    @action
    handleCancel = () => {
        this.showDialog = false;
    }

    changeNativeNum = (event) => {
        callNative(event.target.value);
    }

    render () {
        const friendInfo = this.getFriendInfo(this.store.toUserId);
        const { avatar, nickName, userName} = friendInfo;
        return (
            <div className={s.mewrapper}>
                {this.status === 'profile'
                ? <React.Fragment>
                    <Header midContent='profile' back={this.changePage.bind(this, CHAT)}/>
                    <Profile info={friendInfo}/>
                    {['Set remark', 'Delete friend'].map((item, index) => {
                        return (
                            <div key={index} className={combineCss(s.changeItem, item === 'Delete friend' ? s.last : '')} onClick={this.clickChange.bind(this, item)}>{item}</div>
                        )
                    })}
                    <Modal
                        title="Pay Attention!"
                        visible={this.showDialog}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}>
                        <p>{`Are you Sure to Delete a Friend(${nickName})?`}</p>
                    </Modal>
                </React.Fragment>
                : <div>
                    <Header back={this.clickChange.bind(this, 'profile')} midContent={this.status}>
                        <div onClick={this.save} className={combineCss(s.save, this.isHighLight() ? s.saveHighlight : '')}>save</div>
                    </Header>
                    <Input defaultValue={this.getFriendInfo(this.store.toUserId).nickName} onChange={this.changeTransmisValue.bind(this, 'newFriendNickName')} style={{ marginTop: '.2rem' }}/>
                </div>}
                <Input onChange={this.changeNativeNum}></Input>
            </div>
        );
    }
}

export default FriendInfo;