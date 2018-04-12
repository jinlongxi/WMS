'use strict';

import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import Sound from "../utils/sound";

//给商品赋值
export function updateProductId(productId) {
    //storage.clearMapForKey('storageLocation');    //清空本地保存的库位数据
    return (dispatch) => {
        dispatch({'type': TYPES.UPDATE_PRODUCT_ID,productId});
    };
}

//给库位赋值
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
            //错误的声音
            Sound.playSoundBundleError();
            //弹出窗口
            Alert.alert(
                '库位:' + locationSeqId,
                '库位标识错误或该仓库上无此库位',
                [
                    {
                        text: '确定',
                        onPress: ()=> {

                        }
                    },
                ],
                {cancelable: false}
            );
        }
    };
};

//清空商品id和库位号的数据，因为查询后的页面返回，需要清空
export const clearData = (locationSeqId) => {
    return {
        type: 'CLEAN_PRODUCT_LOCATION_DATA',locationSeqId
    }
};

//根据仓库商品库位号查找库存
export function findInventoryByLocationSeqId(productId,locationSeqId,facilityId) {
    return (dispatch) => {
            //新的页面默认加载loading画面
            dispatch({'type': TYPES.INVENTORY_LOADING,loading:true});
            //请求url地址
            const url = ServiceURl.wmsManager + 'findInventoryGroupByLocation';
            DeviceStorage.get('userInfo').then((userInfo)=> {
                //请求数据
                let formData = new FormData();
                formData.append("login.username", userInfo.username);
                formData.append("login.password", userInfo.password);
                formData.append("facilityId", facilityId);
                formData.append("productId", productId);
                formData.append("locationSeqId", locationSeqId);
                console.log(formData)
                //post请求
                Request.postRequest(url, formData, function (response) {
                    //返回数据（当const {inventoryDate}的情况下，直接获得对应名字的数据）
                    console.log(JSON.stringify(response));
                    const {inventoryDate}=response;
                    const {productSize}=response;
                    const {locationSeqSize}=response;
                    const {productSectionSize}=response;
                    //把数据放入数据树中国年
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








