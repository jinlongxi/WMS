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

//验证SKU是否在本地数据中
export const verifyProduct = (facilityId, locationSeqId, sku, stock, currentSkuList)=> {
    return (dispatch)=> {
        let selectSku = null;
        let effective = Data.list.some((item)=> {
            if (item.productId === sku || item.idValue === sku) {
                selectSku = item
            }
            return item.productId === sku || item.idValue === sku
        });
        if (effective) {
            Sound.playSoundBundleSuccess();
            if (stock === 0) {
                dispatch(deleteSelectSku(selectSku.productId));
            } else {
                dispatch(addSelectSku(selectSku.productId, stock, selectSku.commendLocationSeqId, selectSku.idValue));
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
            formData.append("partyId", userInfo.partyId);
            formData.append("productQuantity", JSON.stringify(productQuantity));
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



