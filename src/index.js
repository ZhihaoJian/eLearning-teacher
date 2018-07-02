import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, Button } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ClassRoom from './routes/ClassRoom/index';
import Login from './routes/Login/Login';

import { store, persistor } from './redux/app.redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RegisterPage from './routes/Register/Register';
import Authorized from './utils/authority';
import Exception from 'ant-design-pro/lib/Exception';

class App extends React.Component {

    render() {
        const actions = (
            <div>
                <Button type="primary"><Link to='/signin'>去登录</Link></Button>
            </div>
        );
        return (
            <Provider store={store} >
                <PersistGate loading={null} persistor={persistor}>
                    <LocaleProvider locale={zh_CN} >
                        <BrowserRouter>
                            <Switch>
                                <Redirect exact from='/' to='/signin' />
                                <Route exact path='/signin' component={Login} />
                                <Route exact path='/register' component={RegisterPage} />
                                <Authorized
                                    path='/'
                                    authority={['TEACHER', 'STUDENT']}
                                    children={(
                                        <BasicLayout>
                                            <ClassRoom />
                                        </BasicLayout>
                                    )}
                                    noMatch={(
                                        <Exception
                                            type="403"
                                            actions={actions}
                                            desc='您尚未登录，暂无权查看'
                                        />
                                    )}
                                />
                            </Switch>
                        </BrowserRouter>
                    </LocaleProvider >
                </PersistGate>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


