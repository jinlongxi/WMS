/**
 * Created by jinlongxi on 17/12/1.
 */
import {Alert} from 'react-native';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import Sound from '../utils/sound';
import * as TYPES from '../constants/ActionTypes';
let increaseStock = 1;

//添加当前库位ID
export const addCurrentPosition = (positionId) => {
    return {
        type: 'ADD_CURRENT_RESERVOIR_INFO',
        currentPositionId: positionId,
    }
};

//添加目标库位ID
export const addTargetPosition = (positionId) => {
    return {
        type: 'ADD_TARGET_RESERVOIR_INFO',
        targetPositionId: positionId,
    }
};

//添加扫描到的SKU
export const addSelectSku = (sku, stock) => {
    return {
        type: 'ADD_SELECT_SKU_INFO',
        sku: sku,
        stock: stock
    }
};

//删除指定SKU
export const deleteSelectSku = (sku) => {
    return {
        type: 'DELETE_SELECT_SKU',
        sku: sku,
    }
};

//禁用扫描表单
export const disableInput = () => {
    return {
        type: 'DISABLE_INPUT',
    };
};

//判断库位合法性
export const verifyFacilityLocation = (facilityId, locationSeqId, locationType, selectPlaceList) => {
    console.log(facilityId, locationSeqId, locationType, selectPlaceList);
    return (dispatch) => {

        //通过本地状态树验证库位合法性
        let facilityLocation = false;
        selectPlaceList.map((item)=> {
            if (item.locationSeqId === locationSeqId) {
                facilityLocation = true
            }
        });
        if (facilityLocation) {
            if (locationType === 'current') {
                Sound.playSoundBundleSuccess();
                dispatch(addCurrentPosition(locationSeqId));
                dispatch(saveCurrentSkuList(facilityId, locationSeqId))
            } else if (locationType === 'target') {
                Sound.playSoundBundleSuccess();
                dispatch(addTargetPosition(locationSeqId))
            }
        } else {
            Sound.playSoundBundleError();
            Alert.alert(
                '库位:' + locationSeqId,
                '库位标识错误或该仓库上无此库位',
                [
                    {
                        text: '确定',
                        onPress: ()=> {
                            console.log('用户点击了确定按钮');
                        }
                    },
                ],
                {cancelable: false}
            );
        }

        //网络请求验证库位合法性
        // const url = ServiceURl.wmsManager + 'find';
        // DeviceStorage.get('userInfo').then((userInfo)=> {
        //     let InputFields = {
        //         facilityId: facilityId,
        //         locationSeqId: locationSeqId
        //     };
        //     let formData = new FormData();
        //     formData.append("login.username", userInfo.username);
        //     formData.append("login.password", userInfo.password);
        //     formData.append("entityName", 'FacilityLocation');
        //     formData.append("noConditionFind", 'Y');
        //     formData.append("inputFields", JSON.stringify(InputFields));
        //     Request.postRequest(url, formData, function (response) {
        //         console.log(JSON.stringify(response));
        //         const {list:list}=response;
        //         if (list.length < 1) {
        //             Sound.playSoundBundleError();
        //             dispatch(disableInput());
        //             Alert.alert(
        //                 '库位:' + locationSeqId,
        //                 '库位标识错误或该仓库上无此库位',
        //                 [
        //                     {
        //                         text: '确定',
        //                         onPress: ()=> {
        //                             console.log('用户点击了确定按钮');
        //                             dispatch(disableInput());
        //                         }
        //                     },
        //                 ],
        //                 {cancelable: false}
        //             );
        //         } else {
        //             if (locationType === 'current') {
        //                 Sound.playSoundBundleSuccess();
        //                 dispatch(addCurrentPosition(locationSeqId))
        //             } else if (locationType === 'target') {
        //                 Sound.playSoundBundleSuccess();
        //                 dispatch(addTargetPosition(locationSeqId))
        //             }
        //         }
        //     }, function (err) {
        //         console.log(JSON.stringify(err));
        //     });
        // })
    };
};

//缓存选中位置全部SKu信息到状态数上
export function saveCurrentSkuList(facilityId, locationSeqId) {
    return (dispatch) => {
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let InputFields = {
                facilityId: facilityId,
                locationSeqId: locationSeqId
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'InventoryItem');
            formData.append("noConditionFind", 'Y');
            formData.append("inputFields", JSON.stringify(InputFields));
            Request.postRequest(url, formData, function (response) {
                const {list:list}=response;
                dispatch({'type': TYPES.SAVE_CURRENT_SKULIST, currentSkuList: list});
                console.log('当前原位置上全部SKU:' + JSON.stringify(response));
            }, function (err) {
                alert('缓存原位置上的SKU列表失败')
            });
        })
    };
}

//判断产品合法性
export const verifyProduct = (facilityId, locationSeqId, sku, stock, currentSkuList) => {
    return (dispatch) => {
        //通过本地状态树验证产品合法性
        let effective = false;
        let effectiveSku;
        currentSkuList.map((item)=> {
            if (item.productId === sku) {
                effective = true;
                effectiveSku = item;
            }
        });

        if (effective) {
            console.log(effectiveSku);
            if (effectiveSku.quantityOnHandTotal < stock) {
                Sound.playSoundBundleError();
                Alert.alert(
                    '扫描数量大于原位置数量',
                    '产品标识:' + sku + '\n' + '原位置数:' + parseInt(effectiveSku.quantityOnHandTotal) + '\n' + '扫描数量:' + stock,
                    [
                        {
                            text: '确定',
                            onPress: ()=>{
                                console.log('用户点击了确定按钮');
                            }
                        },
                    ],
                    {cancelable: false}
                );
            } else if (effectiveSku.quantityOnHandTotal === 0) {
                Sound.playSoundBundleError();
                Alert.alert(
                    '产品标识:' + sku,
                    '产品标识错误或该库位上无此产品',
                    [
                        {
                            text: '确定',
                            onPress: ()=> {
                                console.log('用户点击了确定按钮');
                            }
                        },
                    ],
                    {cancelable: false}
                );
            } else {
                Sound.playSoundBundleSuccess();
                if (stock === 0) {
                    console.log('删除SKU');
                    dispatch(deleteSelectSku(sku));
                } else {
                    console.log('添加或修改SKU');
                    dispatch(addSelectSku(sku, stock));
                }
            }
        } else {
            Sound.playSoundBundleError();
            Alert.alert(
                '产品标识:' + sku,
                '产品标识错误或该库位上无此产品',
                [
                    {
                        text: '确定',
                        onPress: ()=> {
                            console.log('用户点击了确定按钮');
                        }
                    },
                ],
                {cancelable: false}
            );
        }


        //网络请求验证产品合法性
        // const url = ServiceURl.wmsManager + 'getInventoryAvailableByLocation';
        // DeviceStorage.get('userInfo').then((userInfo)=> {
        //     let formData = new FormData();
        //     formData.append("login.username", userInfo.username);
        //     formData.append("login.password", userInfo.password);
        //     formData.append("facilityId", facilityId);
        //     formData.append("locationSeqId", locationSeqId);
        //     formData.append("productId", sku);
        //     Request.postRequest(url, formData, function (response) {
        //         //console.log(JSON.stringify(response));
        //         const {quantityOnHandTotal:quantityOnHandTotal}=response;
        //         if (quantityOnHandTotal === 0) {
        //             Sound.playSoundBundleError();
        //             Alert.alert(
        //                 '产品标识:' + sku,
        //                 '产品标识错误或该库位上无此产品',
        //                 [
        //                     {
        //                         text: '确定',
        //                         onPress: ()=> {
        //                             console.log('用户点击了确定按钮');
        //                         }
        //                     },
        //                 ],
        //                 {cancelable: false}
        //             );
        //         } else if (quantityOnHandTotal < stock) {
        //             Sound.playSoundBundleError();
        //             Alert.alert(
        //                 '扫描数量大于原位置数量',
        //                 '产品标识:' + sku + '\n' + '原位置数:' + quantityOnHandTotal + '\n' + '扫描数量:' + stock,
        //                 [
        //                     {
        //                         text: '确定',
        //                         onPress: ()=>console.log('用户点击了确定按钮')
        //                     },
        //                     {
        //                         text: '取消',
        //                         onPress: () => console.log('用户点击了取消按钮')
        //                     },
        //                 ],
        //                 {cancelable: false}
        //             );
        //         } else {
        //             Sound.playSoundBundleSuccess();
        //             if (stock === 0) {
        //                 console.log('删除SKU');
        //                 dispatch(deleteSelectSku(sku));
        //             } else {
        //                 console.log('添加或修改SKU');
        //                 dispatch(addSelectSku(sku, stock));
        //             }
        //         }
        //     }, function (err) {
        //         console.log(JSON.stringify(err));
        //     });
        // })
    };
};

//清空数据
export const clearData = () => {
    return {
        type: 'CLEAR_SELECT_DATA',
    }
};

//移库
export const multiStockMove = (facilityId, locationSeqId, targetLocationSeqId, productQuantity, selectSkuSize) => {
    return (dispatch) => {
        const url = ServiceURl.wmsManager + 'multiStockMove';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("facilityId", facilityId);
            formData.append("locationSeqId", locationSeqId);
            formData.append("targetLocationSeqId", targetLocationSeqId);
            formData.append("productQuantity", JSON.stringify(productQuantity));
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                //console.log(JSON.stringify(response));
                const {_ERROR_MESSAGE_:_ERROR_MESSAGE_}=response;
                if (_ERROR_MESSAGE_) {
                    console.log(_ERROR_MESSAGE_);
                    alert(_ERROR_MESSAGE_)
                } else {
                    Alert.alert(
                        '移库成功',
                        '当前移动成功数量:' + selectSkuSize,
                        [
                            {
                                text: '确定',
                                onPress: () => {
                                    console.log('点击确定');
                                    dispatch(clearData())
                                }
                            },
                            //{text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
                        ],
                        {cancelable: false}
                    );
                }
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        })
    };
};

