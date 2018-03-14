/**
 * Created by jinlongxi on 18/3/7.
 */
'use strict';

import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';

//添加分拣箱单到本地
export function addPickList(pickData) {
    return (dispatch) => {
        dispatch({'type': TYPES.ADD_PICKLIST, pickData});
    };
}

//修改已分拣数量
export function changeisPicked(fenjianxiangId, location, sku, changeNumber, noPicked) {
    return (dispatch) => {
        dispatch({'type': TYPES.CHANGE_ISPICKED, fenjianxiangId, location, sku, changeNumber});
    };
}

//完成分拣
export function completePicked(fenjianxiangId) {
    return (dispatch) => {
        dispatch({'type': TYPES.COMPLETE_PICKED, fenjianxiangId});
    };
}









