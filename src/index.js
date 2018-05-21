import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ClassRoom from './routes/ClassRoom/index';
import Login from './routes/Login/Login';

import { store, persistor } from './redux/app.redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

class App extends React.Component {
    render() {
        return (
            <Provider store={store} >
                <PersistGate loading={null} persistor={persistor}>
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
                </PersistGate>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


