import React from 'react';
import s from './index.css';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';

@inject('chatStore')
class Header extends React.PureComponent {
    static defaultProps = {
        noBack: false,
        back: () => {},
        midContent: '',
    };

    render() {
        return (
            <div className={s.topBar} style={{ justifyContent: this.props.noBack ? 'space-around' : 'space-between'}}>
                {!this.props.noBack && <div className={s.back} onClick={this.props.back}>{'<'}</div>}
                <div onClick={() => {console.log(toJS(this.props.chatStore))}}>{this.props.midContent}</div>
                {this.props.children || !this.props.noBack && <div>{'    '}</div>}
            </div>
        )
    }
}

export default Header;

