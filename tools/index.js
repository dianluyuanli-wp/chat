const getBothOwner = (item1, item2) => {
    return [item1, item2].sort((a, b) => a > b).join('@');
}

const isFirst = (bothName, name) => bothName.indexOf(name) === 0;

export {getBothOwner};
export {isFirst};