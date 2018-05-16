import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { examsReducers } from './AddExam.redux';
import { addNoteReducers } from './AddNote.redux';


const reduxDevTools = window.devToolsExtension ? window.devToolsExtension() : () => { };

export const store = createStore(
    combineReducers({
        examsReducers,
        addNoteReducers
    }),
    compose(applyMiddleware(thunkMiddleware))
);



