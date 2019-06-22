class Api {
    constructor() {
        this.apiDomain = '';
    }
    get(name) {
        const apiDomain = (process.env.NODE_ENV === 'production' || apiFromLocal.PLACE === 'remote') ? 'http://149.129.83.246/api/' : 'http://localhost:3000/api/';
        //const apiDomain = 'http://149.129.83.246/api/';
        const hostObject = {
            animal: {
                api: apiDomain + '123',
                nickName: '动物接口测试'
            },
            searchName: {
                api: apiDomain + 'searchName',
                //  nickName: '搜索用户'
            },
            addChatUser: {
                api: apiDomain + 'addChatUser',
                //  chat 添加用户
            },
            chatVerify: {
                api: apiDomain + 'chatVerify',
                //  chat 用户登录验证
            },
            addFriend: {
                api: apiDomain + 'addFriend',
                //  好友申请
            },
            userInfo: {
                api: apiDomain + 'userInfo'
                //  拉取用户信息
            },
            agreeFriendReq: {
                api: apiDomain + 'agreeFriendReq'
                //  添加好友
            },
            getAllMessage: {
                api: apiDomain + 'getAllMessage'
                //  获取首页好友的消息
            },
            getMoreMessage: {
                api: apiDomain + 'getMoreMessage'
                //  向上加载更多聊天记录
            }
        }
        return hostObject[name] && hostObject[name].api;
    }
}

export default new Api();