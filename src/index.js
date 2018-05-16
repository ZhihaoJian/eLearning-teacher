import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ClassRoom from './routes/ClassRoom/index';
import Login from './routes/Login/Login';

import { store } from './redux/app.redux';
import { Provider } from 'react-redux';

class App extends React.Component {
    render() {
        return (
            <Provider store={store} >
                <LocaleProvider locale={zh_CN} >
                    <BrowserRouter>
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/' render={() => (
                                <BasicLayout>
                                    <ClassRoom />
                                </BasicLayout>
                            )} />
                        </Switch>
                    </BrowserRouter>
                </LocaleProvider >
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


