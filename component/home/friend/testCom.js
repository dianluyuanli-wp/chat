import React, { useState } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

//  hook测试

function Test() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}></button>
            <button onClick={() => console.log(toJS(this.store))}></button>
        </div>
    )
}

export default inject('chatStore')(observer(Test));