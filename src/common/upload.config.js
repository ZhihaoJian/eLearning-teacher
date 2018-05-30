import { message } from 'antd';

export const COURSE_RESOURCE_PROPS_CONFIG = (that, uploadType) => ({
    name: 'files',
    fileList: that.state.fileList,
    beforeUpload: (file) => {
        if (uploadType && uploadType === 'image') {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                message.error('只能上传jpg或png格式的图片!');
            } else {
                that.setState(({ fileList }) => ({
                    fileList: [file]
                }));
            }
        } else if (uploadType && uploadType === 'video') {
            that.setState(({ fileList }) => ({
                fileList: [...fileList, file]
            }));
        }
        return false;
    },
    onRemove: (file) => {
        that.setState(({ fileList }) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        });
    }
})