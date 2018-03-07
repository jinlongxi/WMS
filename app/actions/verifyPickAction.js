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
export function addpickList(pickData) {
    return (dispatch) => {
        dispatch({'type': TYPES.ADD_PICKLIST,pickData});
    };
}








