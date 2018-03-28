/**
 * Created by jinlongxi on 18/3/28.
 */
'use strict';
import * as TYPES from '../constants/ActionTypes';
const initialState = {
    currentPositionId: null,        //库位
    selectSkuList: [],              //扫描到的SKU列表
    placeholderText: '扫描',         //扫描框默认值
    selectBtn: 1,                   //当前选中按钮
    loading: false,                 //加载动画
    status: null                    //当前运行状态
};

//判断 如果是新的SKU添加到数组中 如果已经存在数量增加
const judgment = (selectSkuList, action) => {
    let back = true;
    for (var i = 0; i < selectSkuList.length; i++) {
        if (selectSkuList[i].sku === action.sku) {
            selectSkuList[i].stock = action.stock;
            let currentSku = selectSkuList[i];
            //把新扫到的SKU放倒第一位
            selectSkuList.splice(i, 1);
            selectSkuList.unshift(currentSku);
            back = false;
            break
        }
    }
    if (back) {
        return [{
            sku: action.sku,
            stock: action.stock,
            commendLocationSeqId: action.commendLocationSeqId,
            eanId: action.eanId
        }, ...selectSkuList,]
    } else {
        return selectSkuList
    }
};

//删除指定商品的SKU
const deleteSku = (selectSkuList, action) => {
    selectSkuList.map((item, index)=> {
        if (item.sku === action.sku) {
            selectSkuList.splice(index, 1);
        }
    });
    return selectSkuList
};

export default function collect(state = initialState, action) {
    switch (action.type) {
        case TYPES.ADD_CURRENT_RESERVOIR_INFO:
            return {
                ...state,
                currentPositionId: action.currentPositionId,
                selectBtn: 3,
                selectSkuList: [],
                loading: false
            };
        case TYPES.ADD_SELECT_SKU_INFO:
            return {
                ...state,
                selectBtn: 3,
                loading: false,
                selectSkuList: judgment(state.selectSkuList, action)
            };
        case TYPES.DELETE_SELECT_SKU:
            return {
                ...state,
                selectSkuList: deleteSku(state.selectSkuList, action)
            };
        case TYPES.CLEAR_SELECT_DATA:
            return {
                ...state,
                currentPositionId: action.locationSeqId ? action.locationSeqId : null,
                targetPositionId: null,
                selectSkuList: [],
                placeholderText: '扫描',
                selectBtn: action.locationSeqId ? 3 : 1,
                verifySkuList: null,
                loading: false
            };
        case TYPES.LOADING:
            return Object.assign({}, state, {
                loading: action.Boole,
                status: action.Boole ? 'loading' : 'Focused'
            });
        default:
            return state;
    }
}
