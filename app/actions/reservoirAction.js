/**
 * Created by jinlongxi on 17/12/1.
 */
import {Alert} from 'react-native';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import Sound from '../utils/sound';
import * as TYPES from '../constants/ActionTypes';

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
export const addSelectSku = (sku, stock, commendLocationSeqId, eanId) => {
    return {
        type: 'ADD_SELECT_SKU_INFO',
        sku,
        stock,
        commendLocationSeqId,
        eanId
    }
};

//加载动画
export const loadingWait = (Boole) => {
    return {
        type: 'LOADING',
        Boole
    }
};

//清空数据
export const clearData = (locationSeqId) => {
    return {
        type: 'CLEAR_SELECT_DATA',
        locationSeqId
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

//更新本地缓存SKU数据
export const updateLocalSkuList = (productQuantity)=> {
    return {
        type: 'UPDATE_LOCAL_SKULIST',
        productQuantity
    }
};

//判断库位合法性
export const verifyFacilityLocation = (facilityId, locationSeqId, locationType, selectPlaceList) => {
    return (dispatch) => {
        //通过本地状态树验证库位合法性
        let facilityLocation = selectPlaceList.some((item)=> {
            return item.locationSeqId === locationSeqId
        });
        //合法通过locationType设置原库位或目标库位的值
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
                            dispatch(loadingWait(false));
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
        //                 console.log('current');
        //                 Sound.playSoundBundleSuccess();
        //                 dispatch(addCurrentPosition(locationSeqId));
        //                 dispatch(saveCurrentSkuList(facilityId, locationSeqId))
        //             } else if (locationType === 'target') {
        //                 console.log('target');
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

//缓存选中位置全部SKU信息到状态数上 包括productId eanId quantityOnHandTotal 推荐库位
export function saveCurrentSkuList(facilityId, locationSeqId) {
    return (dispatch) => {
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let InputFields = {
                facilityId: facilityId,
                locationSeqId: locationSeqId,
                quantityOnHandTotal: 0,
                quantityOnHandTotal_op: 'greaterThan'
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'InventoryItemProductAndGoodIdentification');
            formData.append("noConditionFind", 'Y');
            formData.append("viewIndex", 0);
            formData.append("viewSize", 99999);
            formData.append("inputFields", JSON.stringify(InputFields));
            Request.postRequest(url, formData, function (response) {
                console.log('当前库位SKU列表' + JSON.stringify(response));
                const {_ERROR_MESSAGE_}=response;
                if (_ERROR_MESSAGE_) {
                    alert('接口报错：'+_ERROR_MESSAGE_)
                } else {
                    const {list:list}=response;
                    //去重操作
                    let currentSkuList = [];
                    let sku = null;
                    list.map((item)=> {
                        if (item.productId === sku) {
                            for (let a of currentSkuList) {
                                if (a.productId === sku) {
                                    a.quantityOnHandTotal = parseInt(a.quantityOnHandTotal) + parseInt(item.quantityOnHandTotal)
                                }
                            }
                        } else {
                            currentSkuList.push({
                                productId: item.productId,
                                eanId: item.eanId,
                                quantityOnHandTotal: item.quantityOnHandTotal
                            });
                            sku = item.productId;
                        }
                    });
                    //console.log(currentSkuList);

                    dispatch({'type': TYPES.SAVE_CURRENT_SKULIST, currentSkuList: currentSkuList});
                }
            }, function (err) {
                console.log(err);
                alert('缓存原位置上的SKU列表失败')
            });
        })
    };
}

//查询当前SKU推荐库位
function getProductSuggestLocationSeqIds(facilityId, locationSeqId, productId, returnLocationCount = 3) {
    return new Promise(function (resolve, reject) {
        DeviceStorage.get('userInfo').then((userInfo)=> {
            const url = ServiceURl.wmsManager + 'mobile.getProductSuggestLocationSeqIds';
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("facilityId", facilityId);
            formData.append("locationSeqId", locationSeqId);
            formData.append("productId", productId);
            formData.append("returnLocationCount", returnLocationCount);
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                console.log('查询当前SKU推荐库位:' + JSON.stringify(response));
                resolve(response)
            }, function (err) {
                alert('查询当前SKU推荐库位')
            });
        })
    })
}

//判断产品SKU合法性
export const verifyProduct = (facilityId, locationSeqId, sku, stock, currentSkuList) => {
    return (dispatch) => {
        dispatch(verifyProductLocal(facilityId, locationSeqId, sku, stock, currentSkuList));

        //网络请求验证产品合法性
        // const url = ServiceURl.wmsManager + 'zuczugGetInventoryAvailableAndRecommendLocationByLocation';
        // DeviceStorage.get('userInfo').then((userInfo)=> {
        //     let formData = new FormData();
        //     formData.append("login.username", userInfo.username);
        //     formData.append("login.password", userInfo.password);
        //     formData.append("facilityId", facilityId);
        //     formData.append("locationSeqId", locationSeqId);
        //     formData.append("productId", sku);
        //     formData.append("returnLocationCount", 3);
        //     Request.postRequest(url, formData, function (response) {
        //         console.log('网络请求验证产品合法性' + JSON.stringify(response));
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

//通过本地缓存SKU数据判断SKU合法性
const verifyProductLocal = (facilityId, locationSeqId, sku, stock, currentSkuList)=> {
    return (dispatch)=> {
        //通过本地数据验证产品合法性
        let selectSku = null;
        let effective = currentSkuList.some((item)=> {
            if (item.productId === sku || item.eanId === sku) {
                selectSku = item
            }
            return item.productId === sku || item.eanId === sku
        });
        console.log(selectSku);
        if (effective) {
            if (selectSku.quantityOnHandTotal < stock) {
                Sound.playSoundBundleError();
                Alert.alert(
                    '扫描数量大于原位置数量',
                    '产品标识:' + selectSku.productId + '\n' + '原位置数:' + parseInt(selectSku.quantityOnHandTotal) + '\n' + '扫描数量:' + stock,
                    [
                        {
                            text: '确定',
                            onPress: ()=> {
                                console.log('用户点击了确定按钮');
                                dispatch(loadingWait(false));
                            }
                        },
                    ],
                    {cancelable: false}
                )
            } else if (selectSku.quantityOnHandTotal === 0) {
                Sound.playSoundBundleError();
                Alert.alert(
                    '产品标识:' + selectSku.productId,
                    '产品标识错误或该库位上无此产品',
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
            } else {
                //判断传入的SKU数量为0 在选中SKU列表中删除当前SKU
                Sound.playSoundBundleSuccess();
                if (stock === 0) {
                    dispatch(deleteSelectSku(selectSku.productId));
                } else {
                    getProductSuggestLocationSeqIds(facilityId, locationSeqId, sku).then((data)=> {
                        dispatch(addSelectSku(selectSku.productId, stock, data.commendLocationSeqId, selectSku.eanId));
                    });
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
                            dispatch(loadingWait(false));
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }
};

//移库
export const multiStockMove = (facilityId, locationSeqId, targetLocationSeqId, productQuantity, selectSkuSize) => {
    return (dispatch) => {
        dispatch(loadingWait(true));
        //后台定义了每次最大移库数量为100
        console.log(productQuantity, selectSkuSize);
        if (productQuantity.length > 99) {
            alert('单次最大移库数量不得超过100条SKU')
        } else {
            const url = ServiceURl.wmsManager + 'multiStockMove';
            DeviceStorage.get('userInfo').then((userInfo)=> {
                let formData = new FormData();
                formData.append("login.username", userInfo.username);
                formData.append("login.password", userInfo.password);
                formData.append("facilityId", facilityId);
                formData.append("locationSeqId", locationSeqId);
                formData.append("targetLocationSeqId", targetLocationSeqId);
                formData.append("productQuantity", JSON.stringify(productQuantity));
                Request.postRequest(url, formData, function (response) {
                    //console.log('移库操作:'+JSON.stringify(response));
                    const {_ERROR_MESSAGE_:_ERROR_MESSAGE_}=response;
                    if (_ERROR_MESSAGE_) {
                        Alert.alert(
                            '移库错误',
                            _ERROR_MESSAGE_,
                            [
                                {
                                    text: '确定',
                                    onPress: () => {
                                        dispatch(loadingWait(false));
                                    }
                                },
                            ],
                            {cancelable: false}
                        );
                    } else {
                        Alert.alert(
                            '移库成功',
                            '当前移动成功数量:' + selectSkuSize,
                            [
                                {
                                    text: '确定',
                                    onPress: () => {
                                        console.log('点击确定');
                                        dispatch(updateLocalSkuList(productQuantity));
                                        dispatch(clearData(locationSeqId));
                                        dispatch(loadingWait(false));
                                    }
                                },
                            ],
                            {cancelable: false}
                        );
                    }
                }, function (err) {
                    console.log(JSON.stringify(err));
                    alert('移库请求后台失败！')
                });
            })
        }
    };
};

//导入全部SKU
export const importAllSku = (skuList) => {
    return (dispatch)=> {
        dispatch(loadingWait(true));
        dispatch({type: 'IMPORT_ALL_SKU', skuList})
    }
};


