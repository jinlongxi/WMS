'use strict';

import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import storage from '../utils/storage';


//退出登录
export function updateProductId(productId) {
    //storage.clearMapForKey('storageLocation');    //清空本地保存的库位数据
    return (dispatch) => {
        dispatch({'type': TYPES.UPDATE_PRODUCT_ID,productId});
    };
}

export function updateLocationSeqId(locationSeqId) {
    //storage.clearMapForKey('storageLocation');    //清空本地保存的库位数据
    return (dispatch) => {
        dispatch({'type': TYPES.UPDATE_LOCATION_SEQ_ID,locationSeqId});
    };
}

export function findInventoryByLocationSeqId(productId,locationSeqId,facilityId) {
    console.log(productId,locationSeqId)
    //storage.clearMapForKey('storageLocation');    //清空本地保存的库位数据
    return (dispatch) => {
            dispatch({'type': TYPES.INVENTORY_LOADING,loading:true});
            const url = ServiceURl.wmsManager + 'findInventoryGroupByLocation';
                    DeviceStorage.get('userInfo').then((userInfo)=> {

                        let formData = new FormData();
                        formData.append("login.username", userInfo.username);
                        formData.append("login.password", userInfo.password);
                        formData.append("facilityId", facilityId);
                        formData.append("productId", productId);
                        formData.append("locationSeqId", locationSeqId);
                        console.log(formData)
                        Request.postRequest(url, formData, function (response) {

                            console.log(JSON.stringify(response));
                            const {inventoryDate}=response;
                            const {productSize}=response;
                            const {locationSeqSize}=response;
                            const {productSectionSize}=response;

                            dispatch({'type': TYPES.SAVE_INVENTORY_DATA_SUCCESS,
                                inventoryGroupData: inventoryDate,
                                productSize:productSize,
                                locationSeqSize:locationSeqSize,
                                productSectionSize:productSectionSize});
                        }, function (err) {
                            console.log(JSON.stringify(err));
                            //dispatch({'type': TYPES.GET_PLACELIST_ERROR, error: err});
                        });
                    })
        };
}








