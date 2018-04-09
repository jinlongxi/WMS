/**
 *存放action类型
 */

/*登录模块*********************************************************/
export const APP_LOGIN_DOING = 'APP_LOGIN_DOING';                                               //请求登录
export const APP_LOGIN_SUCCESS = 'APP_LOGIN_SUCCESS';                                           //登录成功
export const APP_LOGIN_ERROR = 'APP_LOGIN_ERROR';                                               //登录失败

export const JUDGE_LOGIN_STATE = 'JUDGE_LOGIN_STATE';                                           //判断登录状态
export const LOGIN_OUT = 'LOGIN_OUT';                                                           //退出登录状态

/*场所模块*********************************************************/
export const GET_PLACELIST_DOING = 'GET_PLACELIST_DOING';                                       //开始请求场所
export const GET_PLACELIST_SUCCESS = 'GET_PLACELIST_SUCCESS';                                   //请求成功
export const GET_PLACELIST_ERROR = 'GET_PLACELIST_ERROR';                                       //请求失败
export const SAVE_SELECT_PLACELIST = 'SAVE_SELECT_PLACELIST';                                   //保存选中场所的库位数据

/*移库模块 库位分拣共用*********************************************************/
export const ADD_CURRENT_RESERVOIR_INFO = 'ADD_CURRENT_RESERVOIR_INFO';                         //添加当前库位信息
export const ADD_TARGET_RESERVOIR_INFO = 'ADD_TARGET_RESERVOIR_INFO';                           //添加目标库位信息
export const ADD_SELECT_SKU_INFO = 'ADD_SELECT_SKU_INFO';                                       //添加选中的商品SKU信息
export const DELETE_SELECT_SKU = 'DELETE_SELECT_SKU';                                           //删除指定商品的SKU
export const DISABLE_INPUT = 'DISABLE_INPUT';                                                   //禁用扫描框
export const SAVE_CURRENT_SKULIST = 'SAVE_CURRENT_SKULIST';                                     //缓存当前原位置SKU列表
export const CLEAR_SELECT_DATA = 'CLEAR_SELECT_DATA';                                           //清空扫描到的全部数据
export const IMPORT_ALL_SKU = 'IMPORT_ALL_SKU';                                                 //导入全部SKU
export const LOADING = 'LOADING';                                                               //加载
export const UPDATE_LOCAL_SKULIST = 'UPDATE_LOCAL_SKULIST';                                     //更新本地状态树上的SKULIST数据

/*分拣模块*********************************************************/
export const INIT_VERIFYPICK_STORE = 'INIT_VERIFYPICK_STORE';                                   //初始化分拣数据（使用本地数据）
export const ADD_PICKLIST = 'ADD_PICKLIST';                                                     //添加分拣单到本地
export const CHANGE_ISPICKED = 'CHANGE_ISPICKED';                                               //修改已分拣数量
export const COMPLETE_PICKED = 'COMPLETE_PICKED';                                               //完成分拣
export const SET_PICKLIST_ARRAY = 'SET_PICKLIST_ARRAY';                                         //设置分拣箱列表数组
export const SET_PICKLIST_LOCATION_ARRAY = 'SET_PICKLIST_LOCATION_ARRAY';                       //设置分拣箱库位数组
export const SET_PICKLIST_LOCATION_SKU_ARRAY = 'SET_PICKLIST_LOCATION_SKU_ARRAY';               //设置分拣箱SKU数组

/*库存查询模块*********************************************************/
export const UPDATE_PRODUCT_ID = 'UPDATE_PRODUCT_ID';                                   //初始化分拣数据（使用本地数据）
export const UPDATE_LOCATION_SEQ_ID = 'UPDATE_LOCATION_SEQ_ID';                                   //初始化分拣数据（使用本地数据）
export const INVENTORY_LOADING = 'INVENTORY_LOADING';                                   //初始化分拣数据（使用本地数据）
export const SAVE_INVENTORY_DATA_SUCCESS = 'SAVE_INVENTORY_DATA_SUCCESS';                                   //初始化分拣数据（使用本地数据）
