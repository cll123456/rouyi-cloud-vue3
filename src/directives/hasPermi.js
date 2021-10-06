/**
* v-hasPermi 操作权限处理
* // 注册
app.directive('my-directive', {
 // 指令是具有一组生命周期的钩子：
 // 在绑定元素的 attribute 或事件监听器被应用之前调用
 created() {},
 // 在绑定元素的父组件挂载之前调用
 beforeMount() {},
 // 绑定元素的父组件被挂载时调用
 mounted() {},
 // 在包含组件的 VNode 更新之前调用
 beforeUpdate() {},
 // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
 updated() {},
 // 在绑定元素的父组件卸载之前调用
 beforeUnmount() {},
 // 卸载绑定元素的父组件时调用
 unmounted() {}
})
* 
*/



import store from '@/store'

export default {
  mounted(el, binding, vnode) {
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