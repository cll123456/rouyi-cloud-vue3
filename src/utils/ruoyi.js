

/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
import { PUBLIC_PATH } from './../config/commonConfig'
import { hsl2rgb, rgb2EleColor, rgb2hsl } from './color'

const baseURL = PUBLIC_PATH

/**
 * 日期格式化
 * @param {*} time  时间
 * @param {*} pattern  {y}-{m}-{d} {h}:{i}:{s} 转化成想要的格式
 * @returns 
 */
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}


/**
 *   添加日期范围
 * @param {*} params 
 * @param {*} dateRange 
 * @param {*} propName 
 * @returns 
 */
export function addDateRange(params, dateRange, propName) {
  let search = params;
  search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
}

/**
 * 回显数据字典 
 * @param {*} datas  对象
 * @param {*} value 
 * @returns 
 */
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].value == ('' + value)) {
      actions.push(datas[key].label);
      return true;
    }
  })
  return actions.join('');
}

/**
 * 回显数据字典（字符串数组）
 * @param {*} datas 
 * @param {*} value 
 * @param {*} separator 
 * @returns 
 */
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue == ('' + temp[val])) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1);
}

/**
 * 通用下载方法
 * @param {*} fileName 文件名称
 */
export function download(fileName) {
  window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}


/**
 * 字符串格式化(%s )
 * @param {*} str 
 * @returns 
 */
export function sprintf(str) {
  var args = arguments, flag = true, i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

/**
 * 转换字符串，undefined,null等转化为""
 * @param {*} str 
 * @returns 
 */
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 数据合并
 * @param {*} source 
 * @param {*} target 
 * @returns 
 */
export function mergeRecursive(source, target) {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}


/**
 * 获取正常的路径
 */
export function getNormalPath(p) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  };
  let res = p.replaceAll('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res;
}

/**
 * 生成element 的color色调，从透明度的.1到.9
 * @param {*} themeColor 
 * @returns 
 */
export function getElColor(themeColor) {
  /**
   * 通过透明度来生成颜色
   * @param {*} color 
   * @param {*} tint 
   * @returns 
   */
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)

      return `#${red}${green}${blue}`
    }
  }
  /**
   * 生成scss mix的函数颜色
   * @param {*} color 
   * @param {*} shade 
   * @returns 
   */
  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  /**
   * 生成scss darken 的函数颜色
   * @param {*} color 
   * @param {*} shade 
   * @returns 
   */
  const darkenColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    // 将rgb转化成hsl
    const [h, s, l] = rgb2hsl(red, green, blue);
    // 将l降低10%并且转换成rgb
    const [r, g, b] = hsl2rgb(h, s, l - shade)

    return rgb2EleColor(`rgb(${r},${g},${b})`)
  }

  const clusters = [themeColor]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(themeColor, Number((i / 10).toFixed(2))))
  }
  // 按钮点击active的mix样式
  clusters.push(shadeColor(themeColor, 0.1))
  // 按钮点击active的darken样式
  clusters.push(darkenColor(themeColor, 0.1))
  return clusters
}