import React from 'react';
import './index.scss';

function Loading() {
    return (
        <div className='loadEffect'>
            {new Array(8).fill('').map((item, index) => <span key={index} />)}
        </div>
    )
}

export default Loading;