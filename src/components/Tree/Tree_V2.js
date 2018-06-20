import React from 'react';
import { Collapse, Tree } from 'antd';
import './index.scss';
import FaFolder from 'react-icons/lib/fa/folder-o';
import FaPlus from 'react-icons/lib/fa/plus';

const ADD_ROOT_FILE = 'ADD_ROOT_FILE';
const ADD_ROOT_FOLDER = 'ADD_ROOT_FOLDER';

export default class TreeV2 extends React.Component {

    render() {
        return (
            <div className='tree' >
                <Collapse
                    defaultActiveKey={'1'}
                >
                    <Collapse.Panel
                        key={'1'}
                        header={
                            (
                                <div className='add-node' >
                                    <a data-type={ADD_ROOT_FILE} onClick={this.props.addRootNode} title='新建文本文件'><FaPlus /></a>
                                    <a data-type={ADD_ROOT_FOLDER} onClick={this.props.addRootNode} title='新建文件夹'><FaFolder /></a>
                                </div>
                            )
                        }
                    >
                        {
                            this.props.gData.length > 0 ? (
                                <Tree
                                    onDragStart={this.props.onDragStart}
                                    onDrop={this.props.onDrop}
                                    loadData={this.props.loadData}
                                    draggable
                                    showIcon
                                    onSelect={this.props.onSelect}
                                    onRightClick={this.props.onRightClick}
                                >
                                    {this.props.loop(this.props.gData)}
                                </Tree>
                            ) : <p style={{ textAlign: "center", margin: 0 }} >点击右上角的图标以创建目录或文件</p>
                        }
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }
}