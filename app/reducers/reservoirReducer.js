'use strict';

import * as TYPES from '../constants/ActionTypes';
const initialState = {
    currentPositionId: null,//原位置
    targetPositionId: null,//目标位置
    selectSkuList: [],
    //selectSkuSize: 0,
    placeholderText: '扫描',
    selectBtn: 1,
    editable: true,
    currentSkuList: [],
    loading: false,
    status: null
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

//本地存库位上的产品
const saveLocalSku = (skuList)=> {
    let localSkuMap = new Map();
    for (let a of skuList) {
        const sku = a.productId.slice(0, 3);
        if (localSkuMap.get(sku)) {
            localSkuMap.set(sku, [...localSkuMap.get(sku), a])
        } else {
            localSkuMap.set(sku, [a])
        }
    }
    return localSkuMap
};

//更新本地状态树上的SKULIST
const updateCurrentSkuList = (currentSkuList, productQuantity)=> {
    for (let a of productQuantity) {
        for (let b of currentSkuList) {
            if (a.productId === b.productId) {
                b.quantityOnHandTotal = b.quantityOnHandTotal - a.quantityMoved
            }
        }
    }
    return currentSkuList.filter((item)=> {
        return item.quantityOnHandTotal !== 0
    })
};

export default function reservoir(state = initialState, action) {
    switch (action.type) {
        case TYPES.ADD_CURRENT_RESERVOIR_INFO:
            return {
                ...state,
                currentPositionId: action.currentPositionId,
                selectBtn: 3,
                selectSkuList: [],
                //placeholderText: action.currentPositionId
            };
        case TYPES.ADD_TARGET_RESERVOIR_INFO:
            return {
                ...state,
                targetPositionId: action.targetPositionId,
                selectBtn: 3,
                loading: false
                //placeholderText: action.targetPositionId
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
                //selectSkuSize: 0,
                placeholderText: '扫描',
                selectBtn: action.locationSeqId ? 3 : 1,
                editable: true,
                currentSkuList: action.locationSeqId ? state.currentSkuList : [],
                verifySkuList: null,
                loading: false
            };
        case TYPES.DISABLE_INPUT:
            return {
                ...state,
                editable: !state.editable
            };
        case TYPES.SAVE_CURRENT_SKULIST:
            return {
                ...state,
                currentSkuList: action.currentSkuList,
                loading: false,
                status: 'Focused'
            };
        case TYPES.IMPORT_ALL_SKU:
            return {
                ...state,
                selectSkuList: action.skuList,
                loading: false,
            };
        case TYPES.LOADING:
            return Object.assign({}, state, {
                loading: action.Boole,
                status: action.Boole ? 'loading' : 'Focused'
            });
        case TYPES.UPDATE_LOCAL_SKULIST:
            return {
                ...state,
                loading: false,
                currentSkuList: updateCurrentSkuList(state.currentSkuList, action.productQuantity),
            };
        default:
            return state;
    }
}
