import hasPermi from './hasPermi';

// 注册指令

const install = function(Vue) {
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install