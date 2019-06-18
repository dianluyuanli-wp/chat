import React from 'react';
import ReactDom from 'react-dom';
import Wrapper from './wrapper';
import { netModel, parseCookie } from 'xiaohuli-package';
import apiMap from '@apiMap';

const loginVerify = async (currentRoute) => {
    const {userName, password} = parseCookie();
    const res = await netModel.post(apiMap.get('chatVerify'), {
        userName: userName,
        passWord: password
    },{});
    if (res !== 'verified' && currentRoute !== 'login') {
        window.location.href='/login.html'
    }  
}
const renderFunction = async() => {
    const mountNode = document.getElementById('main');
    const currentRoute = /(?<=\/).*(?=.html)/g.exec(window.location.pathname)[0];
    loginVerify(currentRoute);
    const userInfo = await netModel.get(apiMap.get('userInfo'),{}, {});
    //  不是主页的话没必要请求聊天记录
    if (currentRoute === 'home') {
        let message = await netModel.get(apiMap.get('getAllMessage'), {}, {});
        userInfo.message = message;
    }
    ReactDom.render((
        <Wrapper userInfo={userInfo}/>
    ),mountNode);
}

renderFunction();