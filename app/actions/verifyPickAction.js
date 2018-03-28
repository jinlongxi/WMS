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
export function changeisPicked(picklistBinId, locationSeqId, SKU, number, isPicked) {
    return (dispatch) => {
        dispatch({'type': TYPES.CHANGE_ISPICKED, picklistBinId, locationSeqId, SKU, number, isPicked});
    };
}
//完成分拣
export function completePicked(picklistBinId) {
    return (dispatch) => {
        dispatch({'type': TYPES.COMPLETE_PICKED, picklistBinId});
    };
}

//初始化数据使用本地数据
export function initVerifyPickStore(StorageData) {
    return (dispatch) => {
        dispatch({'type': TYPES.INIT_VERIFYPICK_STORE, StorageData});
    };
}

//查询仓库中所有的分拣箱+分拣箱的所有数量汇总
export const getPicklistBinByFacility = (facilityId, pickType) => {
    return (dispatch) => {
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let url;
            if (pickType === '订单') {
                url = ServiceURl.wmsManager + 'mobile.getPicklistBinByFacility?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId;
                Request.postRequest(url, null, function (response) {
                    console.log('查询仓库中所有的订单分拣箱+分拣箱的所有数量汇总:' + JSON.stringify(response));
                    let picklistArray = [];
                    const {picklistBinList}=response;
                    for (let a of picklistBinList) {
                        picklistArray.push({
                            'picklistBinId': a.picklistBinId,
                            'noPicked': a.binTotal,
                            'isPicked': 0
                        })
                    }
                    dispatch({'type': TYPES.SET_PICKLIST_ARRAY, picklistArray, pickType});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            } else if (pickType === '货运') {
                url = ServiceURl.wmsManager + 'mobile.findShipmentsByFacilityId?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId;
                console.log(url);
                Request.postRequest(url, null, function (response) {
                    console.log('查询仓库中所有的货运分拣箱+分拣箱的所有数量汇总:' + JSON.stringify(response));
                    const {shipmentList}=response;
                    let picklistArray = [];
                    for (let a of shipmentList) {
                        picklistArray.push({
                            'picklistBinId': a.shipmentId,
                            'noPicked': a.shipmentTotalQuantity,
                            'isPicked': 0
                        })
                    }
                    dispatch({'type': TYPES.SET_PICKLIST_ARRAY, picklistArray, pickType});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            }
        })
    };
};

//查询分拣箱中所有的库位+库位的待分拣数量
export const getLocationsByPicklistBin = (picklistBinId, facilityId, pickType) => {
    return (dispatch) => {
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let url;
            if (pickType === '订单') {
                url = ServiceURl.wmsManager + 'mobile.getLocationsByPicklistBin?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId + '&picklistBinId=' + picklistBinId;
                Request.postRequest(url, null, function (response) {
                    console.log('查询订单分拣箱中所有的库位+库位的待分拣数量:' + JSON.stringify(response));
                    const {picklistBinInfo}=response;
                    let pickListLocationObject = {};
                    let locationArray = [];
                    for (let a in picklistBinInfo.locationMap) {
                        locationArray.push({
                            'location': a,
                            'picklistBinId': picklistBinId,
                            'noPicked': picklistBinInfo.locationMap[a],
                            'isPicked': 0
                        })
                    }
                    pickListLocationObject.picklistBinId = picklistBinId;
                    pickListLocationObject.locationArray = locationArray;
                    dispatch({'type': TYPES.SET_PICKLIST_LOCATION_ARRAY, pickListLocationObject});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            } else if (pickType === '货运') {
                url = ServiceURl.wmsManager + 'mobile.findLocationsByShipmentId?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId + '&shipmentId=' + picklistBinId;
                Request.postRequest(url, null, function (response) {
                    console.log('查询货运分拣箱中所有的库位+库位的待分拣数量:' + JSON.stringify(response));
                    const {shipmentLoctionsInfo}=response;
                    let pickListLocationObject = {};
                    let locationArray = [];
                    for (let a in shipmentLoctionsInfo.locationMap) {
                        locationArray.push({
                            'location': a,
                            'picklistBinId': picklistBinId,
                            'noPicked': shipmentLoctionsInfo.locationMap[a],
                            'isPicked': 0
                        })
                    }
                    pickListLocationObject.picklistBinId = picklistBinId;
                    pickListLocationObject.locationArray = locationArray;
                    dispatch({'type': TYPES.SET_PICKLIST_LOCATION_ARRAY, pickListLocationObject});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            }
        })
    };
};

//按库位查询，有多少 sku +待分拣数量
export const getSKUListByLocationSeqId = (picklistBinId, facilityId, locationSeqId, pickType) => {
    return (dispatch) => {
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let url;
            if (pickType === '订单') {
                url = ServiceURl.wmsManager + 'mobile.getSKUListByLocationSeqId?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId + '&picklistBinId=' + picklistBinId + '&locationSeqId=' + locationSeqId;
                Request.postRequest(url, null, function (response) {
                    console.log('订单分拣箱按库位查询，有多少 sku +待分拣数量:' + JSON.stringify(response));
                    const {locationInfo}=response;
                    let pickListLocationSkuObject = {};
                    let SkuArray = [];
                    for (let a of locationInfo.skuList) {
                        SkuArray.push({
                            'SKU': a.productId,
                            'EAN': a.ean,
                            'locationSeqId': locationSeqId,
                            'noPicked': a.quantity,
                            'isPicked': 0
                        })
                    }
                    pickListLocationSkuObject.locationSeqId = locationSeqId;
                    pickListLocationSkuObject.picklistBinId = picklistBinId;
                    pickListLocationSkuObject.SkuArray = SkuArray;
                    dispatch({'type': TYPES.SET_PICKLIST_LOCATION_SKU_ARRAY, pickListLocationSkuObject});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            } else if (pickType === '货运') {
                url = ServiceURl.wmsManager + 'mobile.findSKUByShipmentLocationId?login.username=' + userInfo.username + '&login.password=' + userInfo.password +
                    '&facilityId=' + facilityId + '&shipmentId=' + picklistBinId + '&locationSeqId=' + locationSeqId;
                Request.postRequest(url, null, function (response) {
                    console.log('货运分拣箱按库位查询，有多少 sku +待分拣数量:' + JSON.stringify(response));
                    const {locationInfo}=response;
                    let pickListLocationSkuObject = {};
                    let SkuArray = [];
                    for (let a of locationInfo.skuList) {
                        SkuArray.push({
                            'SKU': a.productId,
                            'EAN': a.ean,
                            'locationSeqId': locationSeqId,
                            'noPicked': a.quantity,
                            'isPicked': 0
                        })
                    }
                    pickListLocationSkuObject.locationSeqId = locationSeqId;
                    pickListLocationSkuObject.picklistBinId = picklistBinId;
                    pickListLocationSkuObject.SkuArray = SkuArray;
                    dispatch({'type': TYPES.SET_PICKLIST_LOCATION_SKU_ARRAY, pickListLocationSkuObject});
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
            }
        })
    };
};









