/**
 * Created by jinlongxi on 17/12/27.
 */
import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';
import storage from '../utils/storage';

//查询场所列表
export function getPlaceList() {
    return (dispatch) => {
        dispatch({'type': TYPES.GET_PLACELIST_DOING});
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            let InputFields = {
                partyId: userInfo.partyId,
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'FacilityPartyAndFacility');
            formData.append("noConditionFind", 'Y');
            formData.append("inputFields", JSON.stringify(InputFields));
            Request.postRequest(url, formData, function (response) {
                //console.log(JSON.stringify(response));
                let {list:list}=response;
                //去重操作
                let placeList = [];
                let facilityId = null;
                list.map((item)=> {
                    if (item.facilityId !== facilityId) {
                        placeList.push(item);
                        facilityId = item.facilityId
                    }
                });
                dispatch({'type': TYPES.GET_PLACELIST_SUCCESS, placeList: placeList});
            }, function (err) {
                dispatch({'type': TYPES.GET_PLACELIST_ERROR, error: err});
            });
        })
    };
}

//缓存选中场所全部库位信息到状态数上(如果本地有数据使用本地数据)
export function saveSelectPlaceList(facilityId) {
    let facilityIdStorage = facilityId.replace(/_/g, "A");    //storage组件不允许有'_'的KEY
    return (dispatch) => {
        storage.load({
            key: 'storageLocation',
            id: facilityIdStorage,
            autoSync: true,
            syncInBackground: true,
            syncParams: {
                extraFetchOptions: {
                    // blahblah
                },
                someFlag: true,
            },
        }).then(ret => {
            dispatch({'type': TYPES.SAVE_SELECT_PLACELIST, selectPlaceList: ret});
        }).catch(err => {
            //console.log(err);
            dispatch({'type': TYPES.GET_PLACELIST_DOING});
            const url = ServiceURl.wmsManager + 'find';
            DeviceStorage.get('userInfo').then((userInfo)=> {
                let InputFields = {
                    facilityId: facilityId,
                };
                let formData = new FormData();
                formData.append("login.username", userInfo.username);
                formData.append("login.password", userInfo.password);
                formData.append("entityName", 'FacilityLocation');
                formData.append("noConditionFind", 'Y');
                formData.append("viewIndex", 0);
                formData.append("viewSize", 99999);
                formData.append("inputFields", JSON.stringify(InputFields));
                Request.postRequest(url, formData, function (response) {
                    //console.log('缓存库位信息：' + JSON.stringify(response));
                    const {list:list}=response;
                    storage.save({
                        key: 'storageLocation',
                        id: facilityIdStorage,
                        data: list,
                        expires: 1000 * 3600
                    });
                    dispatch({'type': TYPES.SAVE_SELECT_PLACELIST, selectPlaceList: list});
                }, function (err) {
                    console.log(err);
                    alert('请求服务器失败')
                });
            })

        })
    };
}





