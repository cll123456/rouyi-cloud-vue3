import { ref, toRefs, readonly } from "@vue/composition-api";
import { getDicts } from "../api/system/dict/data";

/**
 * 获取字典数据，返回一个对象，解构后就是一一对应的返回结果
 * @param  {...any} args 
 * @returns {*} 对象
 * 
 *  使用方法：
 * const {d} = useDict('d')
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((d, index) => {
      res.value[d] = [];
      getDicts(d).then(resp => {
        res.value[d] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass }))
      })
    })
    return toRefs(res.value);
  })()
}