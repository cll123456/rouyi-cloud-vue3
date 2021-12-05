
/**
 * 公共路径
 */
export const PUBLIC_PATH = import.meta.env.MODE ===  'development' ? '/api/prod-api/' : '/prodapi/prod-api/'

/**
 * 配置当前额外添加的自定义的样式id
 */
export const ELEMENT_SPECIAL_ID = '$$element-id--special';