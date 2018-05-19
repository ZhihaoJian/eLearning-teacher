import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers.redux';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['addNoteReducers', 'examsReducers']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const reduxDevTools = window.devToolsExtension ? window.devToolsExtension() : () => { };

export const store = createStore(
    persistedReducer,
    compose(applyMiddleware(thunkMiddleware), reduxDevTools)
);

export const persistor = persistStore(store);

