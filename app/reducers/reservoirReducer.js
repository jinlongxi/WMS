'use strict';

import * as TYPES from '../constants/ActionTypes';
const initialState = {
    currentPositionId: 'C',
    targetPositionId: 'T',
    selectSkuList: [],
    //selectSkuSize: 0,
    placeholderText: '扫描'
};

//判断 如果是新的SKU添加到数组中 如果已经存在数量增加
const judgment = (selectSkuList, action) => {
    let back = true;
    for (var i = 0; i < selectSkuList.length; i++) {
        if (selectSkuList[i].sku === action.sku) {
            selectSkuList[i].stock = action.stock;
            back = false;
            break
        }
    }
    if (back) {
        return [...selectSkuList, {sku: action.sku, stock: action.stock}]
    } else {
        return selectSkuList
    }
};

export default function reservoir(state = initialState, action) {
    switch (action.type) {
        case TYPES.ADD_CURRENT_RESERVOIR_INFO:
            return {
                ...state,
                currentPositionId: action.currentPositionId,
                placeholderText: action.currentPositionId
            };
        case TYPES.ADD_TARGET_RESERVOIR_INFO:
            return {
                ...state,
                targetPositionId: action.targetPositionId,
                placeholderText: action.targetPositionId
            };
        case TYPES.ADD_SELECT_SKU_INFO:
            return {
                ...state,
                //selectSkuSize: state.selectSkuSize + 1,
                placeholderText: action.sku,
                selectSkuList: judgment(state.selectSkuList, action)
            };
        case TYPES.CLEAR_SELECT_DATA:
            return {
                currentPositionId: 'C',
                targetPositionId: 'T',
                selectSkuList: [],
                selectSkuSize: 0,
                placeholderText: '扫描'
            };
        default:
            return state;
    }
}
