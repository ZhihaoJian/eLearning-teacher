import { combineReducers } from 'redux';
import { examsReducers } from './AddExam.redux';
import { folderTreeReducers } from './FolderTree.redux';

export default combineReducers({
    examsReducers,
    folderTreeReducers
})

