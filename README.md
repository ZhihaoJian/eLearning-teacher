![](https://travis-ci.org/ZhihaoJian/eLearning-teacher.svg?branch=dev)

# 2018.05.23 已知BUG

* 博文上传是否做一个内容长度限制？否则博文过长，后端报错；(Fixed)
* 后端允许上传视频大小需要进一步探讨；
* FolderTree组件交互愈发复杂导致数据状态也愈发复杂，需要采用Redux做数据状态管理，保证数据一致性（需要重写FolderTree组件）；
* TreeNode组件修改名称后会出现无法同步修改后的名称。（疑是上一点数据状态不统一问题引发）(Fixed)
* 视频上传后重新加载根节点，与初次加载根节点所展示的形式有异(Fixed)
