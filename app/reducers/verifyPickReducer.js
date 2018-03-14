/**
 * Created by jinlongxi on 18/3/7.
 */
'use strict';

import * as TYPES from '../constants/ActionTypes';

const initialState = {
    status: null,
    pickList: [],
};

//修改已分拣SKU数量
const changeSkuPickedNumber = (pickList, action) => {
    console.log(pickList);
    let {fenjianxiangId, location, sku, changeNumber}=action;
    for (var i = 0; i < pickList.length; i++) {
        if (pickList[i].fenjianxiangId === fenjianxiangId) {
            for (let a of pickList[i].kuwei) {
                for (let b in a) {
                    if (b === location) {
                        for (let c of a[location]) {
                            if (c.sku === sku) {
                                c.isPicked = parseInt(changeNumber);
                            }
                        }
                    }
                }
            }
        }
    }
    return pickList
};

const completePicked = (pickList, action)=> {
    pickList.map((item, index)=> {
        if (item.fenjianxiangId === action.fenjianxiangId) {
            if (pickList.length > 1) {
                pickList.splice(index, 1);
            } else {
                pickList = []
            }
        }
    });
    return pickList
};

export default function verifyPick(state = initialState, action) {
    switch (action.type) {
        //添加分拣箱单
        case TYPES.ADD_PICKLIST:
            console.log(action.pickData[0]);
            return Object.assign({}, state, {
                pickList: [action.pickData[0], ...state.pickList]
            });
        //修改已分拣SKU数量
        case TYPES.CHANGE_ISPICKED:
            return {
                ...state,
                status: 'change',
                pickList: changeSkuPickedNumber(state.pickList, action)
            };
        //修改已分拣SKU数量
        case TYPES.COMPLETE_PICKED:
            return {
                ...state,
                status: 'done',
                pickList: completePicked(state.pickList, action)
            };
        default:
            return state;
    }
}
