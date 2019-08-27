import { netModel, parseCookie } from 'xiaohuli-package';
import apiMap from '@apiMap';

const getBothOwner = (item1, item2) => {
    return [item1, item2].sort((a, b) => a > b).join('@');
}

const isFirst = (bothName, name) => bothName.indexOf(name) === 0;

export function lookbehindAssertion(content, target) {
    const reverse = (content) => content.split('').reverse().join('');
    const contentRe = reverse(content);
    const rank = contentRe.indexOf(reverse(target));
    if (rank !== -1) {
        return reverse(contentRe.slice(0, rank));
    }
    return '';
}
export function getBgUrl(url) {
    if (!url) {
        return '';
    }
    return 'url(' + url + ')';
}

const getYearMounthDate = function(timeStamp) {
    const DateObj = new Date(timeStamp);
    return DateObj.getFullYear() + '/' + (DateObj.getMonth() + 1) + '/' + DateObj.getDate();
}

const currentTimeStamp = new Date().getTime();
const currentDateStamp = new Date(getYearMounthDate(currentTimeStamp)).getTime();
const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const oneDayMillSec = 24 * 3600 * 1000;
export function getIimeStringForChat(timeStamp) {
    const timeGap = currentDateStamp - timeStamp;
    const res = new Date(timeStamp).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    let prefix = '';
    if (timeGap < 0) {
    } else if (timeGap < oneDayMillSec) {
        prefix = 'Yesterday   '
    } else {
        const dayGap = timeGap / oneDayMillSec; 
        prefix = (dayGap < 6 ? dayMap[new Date(currentDateStamp - dayGap * oneDayMillSec).getDay()] : getYearMounthDate(timeStamp)) + '   ';
    }
    return prefix + res;
}

export const wrapedReq = {
    get: (string, props, opt) => netModel.get(apiMap.get(string), Object.assign(props, { userName: window.chatUserName}, opt)),
    post: (string, props, opt) => netModel.post(apiMap.get(string), Object.assign(props, { userName: window.chatUserName}, opt)),
}

const userInList = (array, item) => array.findIndex(sitem => sitem.userName === item.userName) !== -1;

export function combineCss(...arg) {
    return arg.map(item => `${item}`).join(' ');
}

export {getBothOwner};
export {isFirst};
export {userInList};