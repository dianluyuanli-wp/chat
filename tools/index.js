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

export {getBothOwner};
export {isFirst};