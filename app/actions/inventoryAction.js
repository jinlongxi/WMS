'use strict';

import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import {addCurrentPosition, addTargetPosition, loadingWait, saveCurrentSkuList} from "./reservoirAction";
import Sound from "../utils/sound";

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

//判断库位合法性
export const verifyFacilityLocation = (facilityId, locationSeqId, locationType, selectPlaceList) => {
    return (dispatch) => {
        //通过本地状态树验证库位合法性
        let facilityLocation = selectPlaceList.some((item)=> {
            return item.locationSeqId === locationSeqId
        });
        //合法通过locationType设置原库位或目标库位的值
        if (facilityLocation) {
            dispatch(updateLocationSeqId(locationSeqId))
        } else {
            Sound.playSoundBundleError();
            Alert.alert(
                '库位:' + locationSeqId,
                '库位标识错误或该仓库上无此库位',
                [
                    {
                        text: '确定',
                        onPress: ()=> {
                            dispatch(loadingWait(false));
                        }
                    },
                ],
                {cancelable: false}
            );
        }

    };
};

export function findInventoryByLocationSeqId(productId,locationSeqId,facilityId) {
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








