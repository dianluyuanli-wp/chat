import React from 'react';
import { Provider, observer } from 'mobx-react';
import Entry from '../component/home';
import Login from '../component/login';
import Register from '../component/register';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { parseCookie } from 'xiaohuli-package';
import chatStore from './chatStore';

@observer
class dataWrapper extends React.Component {
    render() {
        const Store = new chatStore(this.props.userInfo);
        return (
            <Provider chatStore={Store}>
                <Router>
                    <Route path='/login.html' component={Login} />
                    <Route path='/register.html' component={Register} />
                    <Route path='/home.html' component={Entry} />
                </Router>
            </Provider>
        )
    }
}

export default dataWrapper;