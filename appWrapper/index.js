import React from 'react';
import ReactDom from 'react-dom';
import Wrapper from './wrapper';
import { netModel, parseCookie } from 'xiaohuli-package';
import apiMap from '@apiMap';
import { lookbehindAssertion } from '@tools';

const loginVerify = async (currentRoute) => {
    const {userName, password} = parseCookie();
    const res = await netModel.post(apiMap.get('chatVerify'), {
        userName: userName,
        passWord: password
    },{});
    if (res !== 'verified' && currentRoute === 'home') {
        window.location.href='/login.html'
    }  
}
const renderFunction = async() => {
    const mountNode = document.getElementById('main');
    const reg = /.*(?=\.html)/;
    const ans = reg.exec(window.location.pathname)[0];
    //  后向断言自实现
    const currentRoute = lookbehindAssertion(ans, '/');
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