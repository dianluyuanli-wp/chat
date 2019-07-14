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