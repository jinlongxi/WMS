/**
 *存放action类型
 */

/*登录模块*********************************************************/
export const APP_LOGIN_DOING = 'APP_LOGIN_DOING';
export const APP_LOGIN_SUCCESS = 'APP_LOGIN_SUCCESS';
export const APP_LOGIN_ERROR = 'APP_LOGIN_ERROR';

export const JUDGE_LOGIN_STATE = 'JUDGE_LOGIN_STATE';                                       //判断登录状态
export const LOGIN_OUT = 'LOGIN_OUT';                                                       //退出登录状态

/*场所模块*********************************************************/
export const GET_PLACELIST_DOING = 'GET_PLACELIST_DOING';
export const GET_PLACELIST_SUCCESS = 'GET_PLACELIST_SUCCESS';
export const GET_PLACELIST_ERROR = 'GET_PLACELIST_ERROR';
export const SAVE_SELECT_PLACELIST = 'SAVE_SELECT_PLACELIST';

/*移库模块*********************************************************/
export const ADD_CURRENT_RESERVOIR_INFO = 'ADD_CURRENT_RESERVOIR_INFO';                     //添加当前库位信息
export const ADD_TARGET_RESERVOIR_INFO = 'ADD_TARGET_RESERVOIR_INFO';                       //添加目标库位信息
export const ADD_SELECT_SKU_INFO = 'ADD_SELECT_SKU_INFO';                                   //添加选中的商品SKU信息
export const DELETE_SELECT_SKU = 'DELETE_SELECT_SKU';                                       //删除指定商品的SKU
export const DISABLE_INPUT = 'DISABLE_INPUT';                                               //禁用扫描框
export const SAVE_CURRENT_SKULIST = 'SAVE_CURRENT_SKULIST';                                 //缓存当前原位置SKU列表
export const CLEAR_SELECT_DATA = 'CLEAR_SELECT_DATA';                                       //清空扫描到的全部数据

/*分拣模块*********************************************************/
export const ADD_PICKLIST='ADD_PICKLIST';                                                   //添加分拣单到本地

