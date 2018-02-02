/**
 * Created by jinlongxi on 17/12/27.
 */
import {Alert} from 'react-native';
import * as TYPES from '../constants/ActionTypes';
import Request from '../utils/request';
import ServiceURl from '../utils/service';
import DeviceStorage from '../utils/deviceStorage';

//查询场所列表
export function getPlaceList() {
    return (dispatch) => {

        dispatch({'type': TYPES.GET_PLACELIST_DOING});
        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            console.log(userInfo);
            let InputFields = {
                partyId: 'dengzewen',                   //这个地方写死了dengwenwen要注意！！！！！！！！！！！！！
                //roleTypeId: 'MANAGER'
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

//缓存选中场所全部库位信息到状态数上
export function saveSelectPlaceList(facilityId) {
    return (dispatch) => {

        const url = ServiceURl.wmsManager + 'find';
        DeviceStorage.get('userInfo').then((userInfo)=> {
            console.log(userInfo, facilityId);
            let InputFields = {
                facilityId: facilityId,
                //locationTypeEnumId: 'FLT_PICKLOC'
            };
            let formData = new FormData();
            formData.append("login.username", userInfo.username);
            formData.append("login.password", userInfo.password);
            formData.append("entityName", 'FacilityLocation');
            formData.append("noConditionFind", 'Y');
            formData.append("viewIndex", 0);
            formData.append("viewSize", 999);
            formData.append("inputFields", JSON.stringify(InputFields));
            console.log(formData);
            Request.postRequest(url, formData, function (response) {
                //console.log(JSON.stringify(response));
                const {list:list}=response;
                dispatch({'type': TYPES.SAVE_SELECT_PLACELIST, selectPlaceList: list});
            }, function (err) {
                alert('请求服务器失败')
            });
        })
    };
}





