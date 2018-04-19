/**
 * Created by jinlongxi on 18/3/28.
 */
/**
 * Created by jinlongxi on 17/12/1.
 */
import {Alert} from 'react-native';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import Sound from '../utils/sound';
import Data from '../components/collect/data';
import DeviceInfo from 'react-native-device-info'
import * as TYPES from '../constants/ActionTypes';

//添加当前库位ID
export const addCurrentPosition = (positionId) => {
    return {
        type: 'ADD_CURRENT_RESERVOIR_INFO',
        currentPositionId: positionId,
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


//判断库位合法性
export const verifyFacilityLocation = (facilityId, locationSeqId, locationType, selectPlaceList) => {
    return (dispatch) => {
        //通过本地状态树验证库位合法性
        let facilityLocation = selectPlaceList.some((item)=> {
            return item.locationSeqId === locationSeqId
        });

        if (facilityLocation) {
            if (locationType === 'current') {
                Sound.playSoundBundleSuccess();
                dispatch(addCurrentPosition(locationSeqId));
            } else if (locationType === 'target') {
                Sound.playSoundBundleSuccess();
                dispatch(addTargetPosition(locationSeqId))
            }

            //当库位正确的情况下，把list数据插入
            dispatch(loadingWait(true));
            const url = ServiceURl.wmsManager + 'findLocationProductMoveRecords';
            DeviceStorage.get('userInfo').then((userInfo)=> {
                let formData = new FormData();
                formData.append("login.username", userInfo.username);
                formData.append("login.password", userInfo.password);
                formData.append("facilityId", facilityId);
                formData.append("locationSeqId", locationSeqId);
                Request.postRequest(url, formData, function (response) {
                    console.log('查询采集数据:' + JSON.stringify(response));
                    const {_ERROR_MESSAGE_}=response;
                    const {_ERROR_MESSAGE_LIST_}=response;
                    const {list}=response;
                    if (!_ERROR_MESSAGE_&&!_ERROR_MESSAGE_LIST_) {
                        Sound.playSoundBundleSuccess();
                        list.map((item)=> {
                            console.log(item)
                            dispatch(addSelectSku(item.productId, item.quantity, item.locationSeqId, item.eanId));
                        });

                        dispatch(loadingWait(false));
                    } else {
                        alert(_ERROR_MESSAGE_+_ERROR_MESSAGE_LIST_);
                        dispatch(loadingWait(false));
                    }
                }, function (err) {
                    console.log(JSON.stringify(err));
                    alert('查询失败')
                });
            })

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
                            dispatch(loadingWait(false));
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    };
};

//验证SKU是否在库位并且获得服务器中原有数据
// export const findLocationProductMoveRecord = (facilityId, locationSeqId, sku, currentSkuList)=> {
//     return (dispatch)=> {
//
//         dispatch(loadingWait(true));
//         const url = ServiceURl.wmsManager + 'findLocationProductMoveRecords';
//         DeviceStorage.get('userInfo').then((userInfo)=> {
//             let formData = new FormData();
//             formData.append("login.username", userInfo.username);
//             formData.append("login.password", userInfo.password);
//             formData.append("facilityId", facilityId);
//             formData.append("locationSeqId", locationSeqId);
//             formData.append("productId", sku);
//             Request.postRequest(url, formData, function (response) {
//                 console.log('查询采集数据:' + JSON.stringify(response));
//                 const {_ERROR_MESSAGE_}=response;
//                 const {quantity}=response;
//                 const {productId}=response;
//                 const {eanId}=response;
//                 if (!_ERROR_MESSAGE_) {
//                     Sound.playSoundBundleSuccess();
//                     dispatch(addSelectSku(productId, quantity+1, locationSeqId, eanId));
//                     dispatch(loadingWait(false));
//                 } else {
//                     alert(_ERROR_MESSAGE_);
//                     dispatch(loadingWait(false));
//                 }
//             }, function (err) {
//                 console.log(JSON.stringify(err));
//                 alert('查询失败')
//             });
//         })
//
//     }
// };
export const findLocationProductMoveRecord = (facilityId, sku)=> {
    return (dispatch)=> {

        dispatch(loadingWait(true));
        const url = ServiceURl.wmsManager + 'findLocationProductMoveRecords';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let formData = new FormData();
            let out = '';
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("facilityId", facilityId);
            formData.append("productId", sku);
            Request.postRequest(url, formData, function (response) {
                console.log('查询采集数据:' + JSON.stringify(response));
                const {_ERROR_MESSAGE_}=response;
                const {_ERROR_MESSAGE_LIST_}=response;
                const {list}=response;
                if (!_ERROR_MESSAGE_&&!_ERROR_MESSAGE_LIST_) {
                    Sound.playSoundBundleSuccess();
                    list.map((item)=> {
                        console.log(item)
                        //dispatch(addSelectSku(item.productId, item.quantity, item.locationSeqId, item.eanId));
                        out = out +item.locationSeqId+"("+item.quantity+")"+"\n";
                    });

                    dispatch(loadingWait(false));
                    Alert.alert(
                        '库位:',
                        out,
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
                    alert(_ERROR_MESSAGE_+_ERROR_MESSAGE_LIST_);
                    dispatch(loadingWait(false));
                }
            }, function (err) {
                console.log(JSON.stringify(err));
                alert('查询失败')
            });
        })

    }
};


//验证SKU是否在本地数据中
export const verifyProduct = (facilityId, locationSeqId, sku, stock, skuList)=> {
    return (dispatch)=> {
        if(locationSeqId==null){
            Alert.alert(
                '原位置不能为空',
                '请先扫描或输入原位置标识',
                [
                    {text: '确定', onPress: () =>
                        {
                            console.log('用户点击了确定按钮');
                            dispatch(loadingWait(false));
                        }

                    },
                ],
                {cancelable: false}
            );
            return;
        }
        let selectSku = null;
        let isHad = skuList!=null?skuList.some((item)=> {
            if (item.sku === sku || item.eanId === sku) {
                selectSku = item
            }
            return item.sku === sku || item.eanId === sku
        }):false;
        console.log(isHad)
        if(isHad){
            console.log("进入本地验证")
            Sound.playSoundBundleSuccess();
            if (stock === 0) {
                dispatch(deleteSelectSku(selectSku.sku));
            } else {
                dispatch(addSelectSku(selectSku.sku, stock, selectSku.locationSeqId, selectSku.eanId));
            }
        }else{
            dispatch(checkData(facilityId, locationSeqId, sku,stock,true));
        }


    }
};


//检测数据
export const checkData = (facilityId, locationSeqId, sku,stock,flag)=> {
    return (dispatch)=> {
        console.log("进入远程验证")
        dispatch(loadingWait(true));
        const url = ServiceURl.wmsManager + 'checkLocationProductMoveRecords';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("productId", sku);
            Request.postRequest(url, formData, function (response) {
                console.log('查询采集数据:' + JSON.stringify(response));
                const {_ERROR_MESSAGE_}=response;
                const {productId}=response;
                const {eanId}=response;
                if (!_ERROR_MESSAGE_) {
                    Sound.playSoundBundleSuccess();
                    console.log(stock+"   "+flag)
                    if(flag){
                        dispatch(addSelectSku(productId, 1, locationSeqId, eanId));
                    }else{
                        dispatch(addSelectSku(productId, stock, locationSeqId, eanId));
                    }
                    dispatch(loadingWait(false));
                } else {
                    Sound.playSoundBundleError();
                    Alert.alert(
                        '产品标识:' + sku,
                        _ERROR_MESSAGE_,
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
            }, function (err) {
                Sound.playSoundBundleError();
                console.log(JSON.stringify(err));
                alert('查询失败')
            });
        })
    }
}


//保存本地数据到服务器
export const multiStockCollect = (facilityId, locationSeqId, productQuantity, selectSkuSize) => {
    console.log(facilityId, locationSeqId, productQuantity, selectSkuSize);
    return (dispatch) => {
        dispatch(loadingWait(true));
        const url = ServiceURl.wmsManager + 'multiAddLocationProductMoveRecords';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("facilityId", facilityId);
            formData.append("locationSeqId", locationSeqId);
            formData.append("equipment", DeviceInfo.getUniqueID());
            //突然获取机器的标码无法使用
            //formData.append("equipment", "");
            formData.append("partyId", userInfo.partyId);
            formData.append("productQuantity", JSON.stringify(productQuantity));
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                console.log('保存采集数据:' + JSON.stringify(response));
                const {_ERROR_MESSAGE_}=response;
                if (!_ERROR_MESSAGE_) {
                    Alert.alert(
                        '保存成功',
                        '当前保存成功数量:' + selectSkuSize,
                        [
                            {
                                text: '确定',
                                onPress: () => {
                                    dispatch(clearData());
                                    dispatch(loadingWait(false));
                                }
                            },
                        ],
                        {cancelable: false}
                    );
                } else {
                    alert('保存采集数据失败');
                    dispatch(loadingWait(false));
                }
            }, function (err) {
                console.log(JSON.stringify(err));
                alert('保存失败')
            });
        })
    }
};


//临时数据拉取
export const pullData = ()=> {
    return (dispatch)=> {
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let InputFields = {
                //goodIdentificationTypeId: 'EAN',
                productId: '181',
                productId_op: 'contains',
                productTypeId: 'finished_good',
                isVirtual: 'N'
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'ProductAndGoodIdentification');
            formData.append("noConditionFind", 'Y');
            formData.append("viewIndex", 0);
            formData.append("viewSize", 99999);
            formData.append("inputFields", JSON.stringify(InputFields));
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                console.log('临时拉取的数据:' + JSON.stringify(response));
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        })
    }
}



