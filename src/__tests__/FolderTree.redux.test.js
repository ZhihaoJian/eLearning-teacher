import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { loadTreeRoot, initState } from '../redux/FolderTree.redux';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test redux folder tree', () => {
    test('LOAD_ROOT_NODE actions should be trigger when fetching root node', () => {
        expect.assertions(1);
        const store = mockStore({ folderTreeReducers: initState });
        return store.dispatch(loadTreeRoot('12965bbe-1042-4132-b62c-40926b3bab92'))
            .then(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual('LOAD_ROOT_NODE');
            })
    });
});
