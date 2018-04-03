/**
 * Created by jinlongxi on 18/3/7.
 */
'use strict';

import * as TYPES from '../constants/ActionTypes';

const initialState = {
    status: null,
    picklistArray: [],
    picklistLocationArray: [],
    picklistLocationSkuArray: [],
    pickType: '',
};

//修改已分拣SKU数量
const changeSkuPickedNumber = (state, action, type) => {
    const {picklistArray, picklistLocationArray, picklistLocationSkuArray}=state;
    const {picklistBinId, locationSeqId, SKU, number, isPicked}=action;

    switch (type) {
        case 'picklistLocationSkuArray':
            for (let i = 0; i < picklistLocationSkuArray.length; i++) {
                if (picklistLocationSkuArray[i].picklistBinId === picklistBinId && picklistLocationSkuArray[i].locationSeqId === locationSeqId) {
                    for (let a of picklistLocationSkuArray[i].SkuArray) {
                        if (a.SKU === SKU) {
                            a.isPicked = number
                        }
                    }
                }
            }
            return state.picklistLocationSkuArray;
        case 'picklistLocationArray':
            for (let i = 0; i < picklistLocationArray.length; i++) {
                if (picklistLocationArray[i].picklistBinId === picklistBinId) {
                    console.log(picklistLocationArray[i]);
                    for (let a of picklistLocationArray[i].locationArray) {
                        if (a.location === locationSeqId) {
                            a.isPicked += number - isPicked
                        }
                    }
                }
            }
            return state.picklistLocationArray;
        case 'picklistArray':
            for (let i = 0; i < picklistArray.length; i++) {
                if (picklistArray[i].picklistBinId === picklistBinId) {
                    picklistArray[i].isPicked += number - isPicked
                }
            }
            return state.picklistArray;
    }
};

const completePicked = (state, action)=> {
    const {picklistArray}=state;
    const {picklistBinId}=action;
    picklistArray.map((item, index)=> {
        if (item.picklistBinId === action.picklistBinId) {
            if (picklistArray.length > 1) {
                picklistArray.splice(index, 1);
            } else {
                state.picklistArray = []
            }
        }
    });
    return state.picklistArray
};

export default function verifyPick(state = initialState, action) {
    switch (action.type) {
        //使用本地存储的分拣箱数据
        case TYPES.INIT_VERIFYPICK_STORE:
            return {
                status: action.StorageData.status,
                picklistArray: action.StorageData.picklistArray,
                picklistLocationArray: action.StorageData.picklistLocationArray,
                picklistLocationSkuArray: action.StorageData.picklistLocationSkuArray,
                pickType: action.StorageData.pickType
            };
        case TYPES.CHANGE_ISPICKED:
            return {
                ...state,
                status: 'change',
                picklistLocationSkuArray: changeSkuPickedNumber(state, action, 'picklistLocationSkuArray'),
                picklistLocationArray: changeSkuPickedNumber(state, action, 'picklistLocationArray'),
                picklistArray: changeSkuPickedNumber(state, action, 'picklistArray')
            };
        case TYPES.LOADING:
            return {
                ...state,
                loading: action.Boole
            };
        //完成分拣
        case TYPES.COMPLETE_PICKED:
            return {
                ...state,
                status: 'done',
                picklistArray: completePicked(state, action)
            };
        //设置分拣箱列表数组
        case TYPES.SET_PICKLIST_ARRAY:
            return {
                ...state,
                picklistArray: action.picklistArray,
                picklistLocationArray: [],
                picklistLocationSkuArray: [],
                pickType: action.pickType,
            };
        //设置分拣箱库位数组
        case TYPES.SET_PICKLIST_LOCATION_ARRAY:
            return {
                ...state,
                picklistLocationArray: [...state.picklistLocationArray, action.pickListLocationObject]
            };
        //设置分拣箱SKU数组
        case TYPES.SET_PICKLIST_LOCATION_SKU_ARRAY:
            return {
                ...state,
                picklistLocationSkuArray: [...state.picklistLocationSkuArray, action.pickListLocationSkuObject]
            };
        default:
            return state;
    }
}
