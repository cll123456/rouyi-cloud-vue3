import { ref, toRefs } from 'vue';
/**
 * 获取table数据
 * @param {*} apiFunc  获取列表方法
 * @returns {loading: boolean,list: [],total: number, getList: useTable}
 * 
 * use const {loading,list,total, getList  } = useTable(api, params)
 */
export function useTable(apiFunc) {
  const res = ref({
    loading: true,
    list: [],
    total: 0,
    getList: (func) => useTable(func)
  });
  return (() => {
    apiFunc.then(resp => {
      res.value.list = resp.rows;
      res.value.total = resp.total;
      res.value.loading = false;
    })
    return toRefs(res.value)
  })()
}
