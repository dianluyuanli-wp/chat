import React from 'react';
import { Input, Form, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { toJS, runInAction } from 'mobx';
import './index.scss';
import { netModel } from 'xiaohuli-package';
import BaseCom from '../../baseStructure/baseCom';
import apiMap from '@apiMap';

@inject('chatStore')
@observer
class Me extends BaseCom {
    state = {
        content: ['2']
    }

    render () {
        return (
            <div className='me-wrapper'>
                <div onClick={() => {console.log(toJS(this.store))}}>点一点</div>
                <div onClick={
                    () => {
                        const a = this.state.content.concat(['1'])
                        this.setState({content: a})}
                    }>添加
                </div>
                <div className='me-wrapper'>
                    {this.state.content.map((item, index) => {
                        return (<div key={index}>
                            {item}
                        </div>)
                    })}
                </div>
            </div>
        );
    }
}

export default Me;