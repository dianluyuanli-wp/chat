import React from 'react';
import { action } from 'mobx';
import { getBothOwner, isFirst } from '@tools';

class BaseCom extends React.Component {
    get store() {
        return this.props.chatStore;
    }

    @action.bound changeInput = (props, event) => {
        this.store[props] = event.target.value;
    }

    @action.bound initMessage = (sender, receiver, content) => {
        const bothOwner = getBothOwner(sender, receiver);
        const isMyFirst = isFirst(bothOwner, sender);
        runInAction(() => {
          this.store.message.push({
              message: [this.createMessage(sender,content)],
              bothOwner: bothOwner,
              user1_flag: isMyFirst ? 1 : 0,
              user2_flag: isMyFirst ? 0 : 1
          })
        })
    }

    createMessage = (owner, content) => ({
        content,
        owner,
        timeStamp: new Date().valueOf()
    })

    updateMesRank = (updateRemote = true) => {
        if (updateRemote) {
            this.store.socketIoObj.emit('updateMessRank', this.store.userName, this.store.toUserId);
        }
        const target = this.getChatList(this.store.toUserId)[0];
        const myFirst = isFirst(target.bothOwner, this.store.userName);
        if (myFirst) {
            target.user1_flag = target.user2_flag;
        } else {
            target.user2_flag = target.user1_flag;
        }
    }

    getChatList = (friend) => {
        return this.store.message.filter(item => item.bothOwner.includes(friend));
    }

    rankMark = (identity, athor) => {
        const target = this.getChatList(athor);
        const {bothOwner, user1_flag, user2_flag} = target[0];
        if (identity === 'sender') {
            const myFirst = isFirst(bothOwner, this.store.userName);
            if (myFirst) {
                target[0].user1_flag += 1;
            } else {
                target[0].user2_flag += 1;
            }
        } else {
            const friendFirst = isFirst(bothOwner, athor);
            const up = Math.max(user1_flag, user2_flag) + 1;
            if (friendFirst) {
                target[0].user1_flag = up;
            } else {
                target[0].user2_flag = up;
            }
        }
    }
}

export default BaseCom;