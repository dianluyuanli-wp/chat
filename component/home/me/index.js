import React, { lazy, Suspense } from 'react';
import { Input, Form, Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction, observable, action } from 'mobx';
import s from './index.css';
//import Avatar from './upload';
import { getBgUrl, combineCss, wrapedReq } from '@tools';
import { writeCookie } from 'xiaohuli-package';
import Loading from '@UI/loading';
import BaseCom from '../../baseStructure/baseCom';

import { Profile, Header } from '@UI';

const AvatarCom = lazy(() => import(/* webpackChunkName: "upload" */ './upload'));
const Avatar = (props) => (
    <Suspense fallback={Loading()}>
        <AvatarCom {...props}/>
    </Suspense>
)
@inject('chatStore')
@observer
class Me extends BaseCom {
    state = {
        status: 'profile'
    }

    @observable newNickname = this.store.nickName;
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
            } else if (await wrapedReq.post('chatVerify', {
                userName: this.store.userName,
                passWord: this.oldPass
            },{}) !== 'verified') {
                message.error('原密码输入错误');
                return;
            }
        }
        const ans = await wrapedReq.post('updateUserInfo', {changeObj: this.changeMap[key].transferObj()}, {});
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
            isHighLight: () => this.base64Img !== '',
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

    logOut = () => {
        writeCookie({password: ''}, 10);
        window.location.href='/login.html';
    }

    render () {
        return (
            <div className={s.mewrapper}>
                {this.state.status === 'profile'
                ? <React.Fragment>
                    <Header noBack={true} midContent={'Me'} />
                    <Profile info={this.getMyInfoObj()}/>
                    {['Nickname', 'Avatar', 'Password'].map((item, index) => {
                        return (
                            <div key={index} className={combineCss(s.changeItem, s['ch' + item])} onClick={this.clickChange.bind(this, item)}>{item}</div>
                        )
                    })}
                    <div className={combineCss(s.changeItem, s.logOut)} onClick={this.logOut}>Log Out</div>
                </React.Fragment>
                : <div className={s.edit}>
                    <Header back={this.clickChange.bind(this, 'profile')} midContent={this.state.status}>
                        <div onClick={this.save.bind(this, this.state.status)} className={combineCss(s.save, this.changeMap[this.state.status].isHighLight() ? s.saveHighlight : '')}>save</div>
                    </Header>
                    {this.changeMap[this.state.status].render()}
                </div>}
            </div>
        );
    }
}

export default Me;