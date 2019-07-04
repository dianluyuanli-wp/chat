import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, observable, action } from 'mobx';
import s from './index.css';
import { netModel } from 'xiaohuli-package';
import Avatar from './upload';
import { getBgUrl, combineCss } from '@tools';
import BaseCom from '../../baseStructure/baseCom';
import apiMap from '@apiMap';

@inject('chatStore')
@observer
class Me extends BaseCom {
    state = {
        status: 'profile'
    }

    @observable newNickname = '';
    @observable oldPass = '';
    @observable newPass = '';
    @observable newPassAgain = '';
    @observable base64Img = '';

    clickChange = (content) => {
        this.setState({
            status: content
        });
    }

    @action
    changeTransmisValue = (props, event) => {
        this[props] = event.target.value;
    }

    changeNickname = () => {
        return <Input defaultValue={this.store.nickName} onChange={this.changeTransmisValue.bind(this, 'newNickname')} style={{ marginTop: '.2rem' }}/>
    }

    @action
    updateImg = (value) => {
        this.base64Img = value;
    }

    changePassword = () => {
        return (
            <React.Fragment>
                <Input.Password addonBefore={<span className={s.spanAdd}>original password</span>} onChange={this.changeInput.bind(this, this, 'oldPass')} placeholder={'Enter old password'} style={{ marginTop: '.2rem' }}/>
                <Input.Password addonBefore={<span className={s.spanAdd}>new password</span>} placeholder={'Enter new password'} onChange={this.changeInput.bind(this, this, 'newPass')}/>
                <Input.Password addonBefore={<span className={s.spanAdd}>confirm password</span>} placeholder={'Enter new password again'} onChange={this.changeInput.bind(this, this, 'newPassAgain')}/>
            </React.Fragment>
        )
    }

    save = async (key) => {
        if (!this.changeMap[key].isHighLight()) {
            return ;
        }
        if (key === 'Password') {
            if (this.newPass !== this.newPassAgain) {
                message.error('两次新密码输入不一致');
                return;
            } else if (await netModel.post(apiMap.get('chatVerify'), {
                userName: this.store.userName,
                passWord: this.oldPass
            },{}) !== 'verified') {
                message.error('原密码输入错误');
                return;
            }
        }
        const ans = await netModel.post(apiMap.get('updateUserInfo'), {changeObj: this.changeMap[key].transferObj()}, {});
        if (ans === 'success') {
            message.success('保存成功');
            runInAction(() => {
                this.changeMap[key].postCB();
            })
        }
    }

    changeMap = {
        Nickname: {
            render: this.changeNickname,
            isHighLight: () => this.newNickname !== this.store.nickName,
            transferObj: () => ({nickName: this.newNickname}),
            postCB: () => {this.store.nickName = this.newNickname}
        },
        Avatar: {
            render: () => <Avatar updateIMg = {this.updateImg}/>,
            isHighLight: () => true,
            transferObj: () => ({avatar: this.base64Img}),
            postCB: () => {this.store.avatar = this.base64Img}
        },
        Password: {
            render: this.changePassword,
            isHighLight: () => this.oldPass && this.newPass && this.newPassAgain,
            transferObj: () => ({passWord: this.newPass}),
            postCB: () => {}
        }
    }

    render () {
        return (
            <div className={s.mewrapper}>
                {this.state.status === 'profile'
                ? <React.Fragment>
                    <div onClick={() => {console.log(toJS(this.store))}} className={s.meavatarbar}>
                        <div className={s.meavatar} style={{ backgroundImage: getBgUrl(this.getAvatar())}}>
                        </div>
                        <div className={s.wrapper}>
                            <div className={s.nickname}>{this.store.nickName || this.store.userName}</div>
                            <div className={s.uid}>chatID: {this.store.userName}</div>
                        </div>
                    </div>
                    {['Nickname', 'Avatar', 'Password'].map((item, index) => {
                        return (
                            <div key={index} className={combineCss(s.changeItem, s['ch' + item])} onClick={this.clickChange.bind(this, item)}>{item}</div>
                        )
                    })}
                </React.Fragment>
                : <div className={s.edit}>
                    <div className={s.topBar}>
                        <div className={s.back} onClick={this.clickChange.bind(this, 'profile')}>{'<'}</div>
                        <div className={s.midContent}>{this.state.status}</div>
                        <div onClick={this.save.bind(this, this.state.status)} className={combineCss(s.save, this.changeMap[this.state.status].isHighLight() ? s.saveHighlight : '')}>save</div>
                    </div>
                    {this.changeMap[this.state.status].render()}
                </div>}
            </div>
        );
    }
}

export default Me;