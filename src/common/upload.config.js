export const COURSE_RESOURCE_PROPS_CONFIG = (that) => ({
    action: '//jsonplaceholder.typicode.com/posts/',
    fileList: that.state.fileList,
    beforeUpload: (file) => {
        that.setState(({ fileList }) => ({
            fileList: [...fileList, file]
        }));
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