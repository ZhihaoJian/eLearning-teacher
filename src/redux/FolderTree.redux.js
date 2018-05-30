import Axios from "axios";
import { message } from 'antd';

const LOAD_ROOT_NODE = 'LOAD_ROOT_NODE';
const UPDATE_TREE_DATA = 'UPDATE_TREE_DATA';
const UPDATE_EDITOR_CONTENT = 'UPDATE_EDITOR_CONTENT';
const UPDATE_STATE = 'UPDATE_STATE';
const RESET_TREE_DATA = 'RESET_TREE_DATA';
const initState = {
    selectKey: '',
    content: '',
    treeData: [],
    visible: false,
    disabled: true,
    nodeID: null,
    uploadData: null,
    isVideo: false,
    savePath: '',
}

export const folderTreeReducers = (state = initState, action) => {
    switch (action.type) {
        case LOAD_ROOT_NODE:
            return { ...initState, treeData: action.payload }
        case UPDATE_TREE_DATA:
            return { ...state, treeData: action.treeData }
        case UPDATE_EDITOR_CONTENT:
            return { ...state, content: action.content }
        case UPDATE_STATE:
            return { ...state, ...action.payload }
        case RESET_TREE_DATA:
        default:
            return { ...initState }
    }
}

const loadRootNode = (data) => {
    return { type: LOAD_ROOT_NODE, payload: data }
}

const updateTreeData = treeData => {
    return { type: UPDATE_TREE_DATA, treeData: [...treeData] }
}

/**
 * 只更新必要的结点
 * @param {*} oldTree 当前的tree
 * @param {*} newRootNodes 后台返回的根节点
 */
const updateNessaryNode = (newRootNodes, oldTree = []) => {
    const oldLength = oldTree.length;
    const newLength = newRootNodes.length;
    let nodes = [];
    if (oldLength < newLength) {
        newRootNodes.forEach(v => {
            const index = oldTree.findIndex((o) => o.id === v.id);
            if (index === -1) {
                nodes.push(v);
            }
        });
        nodes.forEach(v => oldTree.push(v));
        return oldTree;
    }
    //删
    else if (oldLength > newLength) {
        oldTree.forEach(v => {
            const index = newRootNodes.findIndex((o) => o.id === v.id);
            if (index === -1) {
                nodes.push(v);
            }
        });
        nodes.forEach(v => {
            const index = oldTree.findIndex(el => el.id === v.id);
            oldTree.splice(index, 1);
        })
        return oldTree;
    }
    //改
    else {
        oldTree.forEach((v, i) => {
            Object.assign(v, newRootNodes[i]);
        })
        return oldTree;
    }
}


/**
 * 加载根节点
 * @param {String} courseId 课程ID
 */
export const loadTreeRoot = (courseId) => {
    return (dispatch, getState) => {
        Axios.post(`/courseNode/findCourseNodeByIsRoot/${true}/${courseId}`)
            .then(res => {
                const responseData = res.data.result;
                const oldData = [...getState().folderTreeReducers.treeData];
                if (res.status === 200) {
                    const processedData = responseData.map(v => ({ ...v, isLeaf: v.leaf }));
                    const treeData = updateNessaryNode(processedData, oldData);
                    dispatch(loadRootNode(treeData));
                } else {
                    message.error('Oops,稍微出现了一点错误，刷新试试?');
                    dispatch(loadRootNode([]));
                }
            })
    }
}

/**
 * 展开tree node 加载 child node
 * @param {String} key 展开结点的 key
 */
export const onLoadChildData = ({ node, courseId, parentKey }) => {
    return (dispatch, getState) => {
        return Axios.post(`/courseNode/findCourseNode/${parentKey}/${courseId}`)
            .then(res => {
                const resData = res.data.result;
                if (res.status === 200) {
                    node.children = resData.length ?
                        resData.map(v => {
                            return v.leaf ? { ...v, isLeaf: v.leaf } : { ...v, isLeaf: v.leaf, children: [{ nodeKey: `${v.nodeKey}-0`, isLeaf: true, key: `${v.nodeKey}-0` }] };
                        }) :
                        [{ nodeKey: `${node.nodeKey}-0`, isLeaf: true, key: `${node.nodeKey}-0` }];
                    dispatch(updateTreeData(getState().folderTreeReducers.treeData))
                } else {
                    message.error('Oops,稍微出现了一点错误，刷新试试?');
                }
            })
    }
}

/**
 * 更新结点名称
 * @param {Object} data  更新节点的参数
 */
export const updateNodeName = data => {
    return (dispatch) => {
        return Axios.post('/courseNode/updateCourseNodeName', data)
            .then(res => {
                if (res.status === 200) {
                    message.success('已同步到云');
                } else {
                    message.error('出了点小问题, 刷新试试?')
                }
            })
    }
}

/**
 *  更新树
 */
export const updateTree = (newTreeData, callBack) => {
    return (dispatch) => {
        dispatch(updateTreeData(newTreeData));
        if (typeof callBack === 'function') {
            callBack();
        }
    }
}


/**
 * 添加课程结点
 */
export const addTreeNode = (node, callBack) => {
    return dispatch => {
        return Axios.post('/courseNode/addCourseNode', node)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.result;
                    callBack(data)
                } else {
                    message.error('Oops,稍微出现了一点错误，刷新试试?');
                }
            })
    }
}

/**
 * 删除指定结点
 * @param {Array} newTreeData 
 * @param {String} key 
 */
export const deleteNode = (key) => {
    return (dispatch, getState) => {
        return Axios.post(`/courseNode/delCourseNode/${key}`)
            .then(res => {
                if (res.status === 200) {
                    message.success('已同步到云');
                } else {
                    message.error('Oops,稍微出现了一点错误，刷新试试?');
                }
            })
    }
}

/**
 * 更新编辑器内容显示
 * @param {String} content 
 */
export const updateEditorContent = (content) => {
    return dispatch => dispatch({ type: UPDATE_EDITOR_CONTENT, content })
}

/**
 * 保存文本到云端
 * @param {Object} data 
 * @param {String} courseId 
 */
export const saveEditorContent = (data) => {
    return dispatch => {
        return Axios.post(`/courseNode/updateContentById`, data)
            .then(res => {
                if (res.status === 200) {
                    message.success('内容已存储到云');
                    return res.data.result;
                } else {
                    message.error('稍微出了点问题');
                }
            })
    }
}


/**
 * 更新多个状态
 * @param {Object} updateData 
 */
export const updateStates = (updateData, callBack) => {
    return dispatch => {
        dispatch({ type: UPDATE_STATE, payload: updateData });
        if (callBack) {
            callBack();
        }
    }
}

/**
 * 上传课程资源
 * @param {Object} formData 课程资视频
 */
export const updateCourseVideo = (formData) => {
    return dispatch => {
        return Axios.post(`/courseNode/addCourseVideo`, formData)
            .then(res => {
                if (res.status === 200) {
                    message.success('资源上传成功!');
                } else {
                    message.error('上传失败');
                }
            })
    }
}

/**
 * 加载文本数据 
 * @param {String} savePath 文本保存路路径
 */
export const loadFileContent = (nodeID) => {
    return dispatch => {
        return Axios.get(`/courseNode/loadFile/${nodeID}`)
            .then(res => {
                if (res.status === 200) {
                    return res.data.result.content;
                } else {
                    message.error('出错了，刷新试试')
                }
            })
    }
}

/**
 * 重置treeData
 */
export const reset = () => {
    return dispatch => dispatch({ type: RESET_TREE_DATA })
}