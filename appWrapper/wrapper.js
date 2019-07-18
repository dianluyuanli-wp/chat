import React, { lazy, Suspense } from 'react';
import { Provider, observer } from 'mobx-react';
import Entry from '../component/home';
//import Login from '../component/login';
//import Register from '../component/register';
import { BrowserRouter as Router, Route } from "react-router-dom";
import chatStore from './chatStore';
import Loadable from 'react-loadable';  //  这个支持后端渲染

const LoginCom = lazy(() => import(/* webpackChunkName: 'login' */ '../component/login'));

const Login = () => (
    <Suspense fallback={<p>Loading...</p>}>
        <LoginCom />
    </Suspense>
)
const Register = Loadable({
    loader: import(/* webpackChunkName: 'register' */'../component/register'),
    loading: <div>123</div>
})

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