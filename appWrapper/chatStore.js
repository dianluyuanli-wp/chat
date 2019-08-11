import { observable } from 'mobx';
import { FRIENDS } from '@constants';

class ChatStore {
    @observable message = [];
    @observable userName = '1';
    @observable toUserId = '2';
    @observable pageKey = FRIENDS;
    @observable searchList = [];
    @observable nickName = '';
    @observable avatar = '';
    @observable friendsList = [];
    @observable friendRequest = [];
    @observable socketIoObj = {};
    @observable allPopUp = 0;
    constructor(opts) {
        this.message = opts?.message || [];
        this.userName = opts?.userName || '';
        this.nickName = opts?.nickName || '';
        this.avatar = opts?.avatar || '';
        this.friendsList = opts?.friendsList || [];
        this.friendRequest = opts?.friendRequest || [];
        this.message = opts?.message || [];
    }
}

export default ChatStore;