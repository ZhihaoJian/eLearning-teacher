import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import { Utils } from './utils';

/**
 * 路由权限验证
 * 
 * 更多请看，https://pro.ant.design/components/Authorized-cn/
 */
const getAuthority = () => {
  const userStr = Utils.getItemFromLocalStorage('user');
  if (userStr) {
    const authority = JSON.parse(userStr).authorities[0].authority;
    return authority;
  } else {
    return '';
  }
}

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
