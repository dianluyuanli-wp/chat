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
    render () {
        return (
            <div onClick={() => {console.log(toJS(this.store))}}>点一点</div>
        )
    }
}

export default Me;