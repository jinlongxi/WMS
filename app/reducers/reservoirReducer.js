'use strict';

import * as TYPES from '../constants/ActionTypes';
const initialState = {
    currentPositionId: null,
    targetPositionId: null,
    selectSkuList: [],
    //selectSkuSize: 0,
    placeholderText: '扫描',
    selectBtn: 1,
    editable: true,
    currentSkuList: [],
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
        return [{sku: action.sku, stock: action.stock}, ...selectSkuList,]
    } else {
        return selectSkuList
    }
};

//删除指定商品的SKU
const deleteSku = (selectSkuList, action) => {
    console.log(selectSkuList, action.sku);
    selectSkuList.map((item, index)=> {
        if (item.sku === action.sku) {
            selectSkuList.splice(index, 1);
        }
    });
    return selectSkuList
};

export default function reservoir(state = initialState, action) {
    switch (action.type) {
        case TYPES.ADD_CURRENT_RESERVOIR_INFO:
            return {
                ...state,
                currentPositionId: action.currentPositionId,
                selectBtn: 3
                //placeholderText: action.currentPositionId
            };
        case TYPES.ADD_TARGET_RESERVOIR_INFO:
            return {
                ...state,
                targetPositionId: action.targetPositionId,
                selectBtn: 3
                //placeholderText: action.targetPositionId
            };
        case TYPES.ADD_SELECT_SKU_INFO:
            return {
                ...state,
                selectBtn: 3,
                //selectSkuSize: state.selectSkuSize + 1,
                //placeholderText: action.sku,
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
                currentPositionId: action.currentPositionId,
                targetPositionId: null,
                selectSkuList: [],
                selectSkuSize: 0,
                selectBtn: action.selectBtn,
                placeholderText: '扫描'
            };
        case TYPES.DISABLE_INPUT:
            return {
                ...state,
                editable: !state.editable
            };
        case TYPES.SAVE_CURRENT_SKULIST:
            return {
                ...state,
                currentSkuList: action.currentSkuList
            };
        default:
            return state;
    }
}
