



import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    // 获取权限的值
    const { value } = binding;
    //  默认所有权限
    const all_permission = "*:*:*";
    // 获取store中的所有权限 ["system:user:resetPwd", "system:post:list", "monitor:operlog:export",...]
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      // 如果不存在权限则移除掉当前的dom
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}