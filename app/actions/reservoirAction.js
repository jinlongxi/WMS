/**
 * Created by jinlongxi on 17/12/1.
 */
import {Alert} from 'react-native';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
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

//判断库位合法性
export const verifyFacilityLocation = (facilityId, locationSeqId, locationType) => {
    return (dispatch) => {
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let InputFields = {
                facilityId: 'B2C_WAREHOUSE',
                locationSeqId: locationSeqId
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'FacilityLocation');
            formData.append("noConditionFind", 'Y');
            formData.append("inputFields", JSON.stringify(InputFields));
            Request.postRequest(url, formData, function (response) {
                //console.log(JSON.stringify(response));
                const {list:list}=response;
                if (list.length < 1) {
                    alert('当前库位信息不合法');
                } else {
                    if (locationType === 'current') {
                        dispatch(addCurrentPosition(locationSeqId))
                    } else if (locationType === 'target') {
                        dispatch(addTargetPosition(locationSeqId))
                    }
                }
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        })
    };
};

//判断产品合法性
export const verifyProduct = (facilityId, locationSeqId, sku, stock) => {
    return (dispatch) => {
        const url = ServiceURl.wmsManager + 'getInventoryAvailableByLocation';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("facilityId", 'B2C_WAREHOUSE');
            formData.append("locationSeqId", locationSeqId);
            formData.append("productId", sku);
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                console.log(JSON.stringify(response));
                const {quantityOnHandTotal:quantityOnHandTotal}=response;
                if (quantityOnHandTotal === 0) {
                    alert('当前库位没有此产品');
                } else if (quantityOnHandTotal < stock) {
                    alert('当前库位产品数量:' + quantityOnHandTotal + '< 扫描数量:' + stock);
                } else {
                    console.log(sku, stock);
                    dispatch(addSelectSku(sku, stock));
                }
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        })
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
            formData.append("facilityId", 'B2C_WAREHOUSE');
            formData.append("locationSeqId", locationSeqId);
            formData.append("targetLocationSeqId", targetLocationSeqId);
            formData.append("productQuantity", JSON.stringify(productQuantity));
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                console.log(JSON.stringify(response));
                const {_ERROR_MESSAGE_:_ERROR_MESSAGE_}=response;
                if (_ERROR_MESSAGE_) {
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
                            {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
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

