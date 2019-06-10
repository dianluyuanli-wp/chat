import React from 'react';
import ReactDom from 'react-dom';
import Wrapper from './wrapper';
import { netModel, parseCookie } from 'xiaohuli-package';
import apiMap from '@apiMap';

const loginVerify = async () => {
    const {userName, password} = parseCookie();
    const currentRoute = /(?<=\/).*(?=.html)/g.exec(window.location.pathname)[0];
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
    loginVerify();
    const userInfo = await netModel.get(apiMap.get('userInfo'),{}, {});
    const message = await netModel.get(apiMap.get('getAllMessage'), {}, {});
    userInfo.message = message;
    ReactDom.render((
        <Wrapper userInfo={userInfo}/>
    ),mountNode);
}

renderFunction();