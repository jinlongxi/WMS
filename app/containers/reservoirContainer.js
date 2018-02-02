/**
 * Created by jinlongxi on 17/12/1.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    verifyFacilityLocation,
    clearData,
    verifyProduct,
    multiStockMove
} from '../actions/reservoirAction';
import Reservoir from '../components/reservoir/reservoir';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

const mapStateToProps = (state) => {
    return {
        reservoirState: state.reservoirStore,
        placeState:state.placeStore
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        //验证库位合法性
        verifyFacilityLocation: (facilityId, locationSeqId, locationType,selectPlaceList)=> {
            dispatch(verifyFacilityLocation(facilityId, locationSeqId, locationType,selectPlaceList))
        },
        //验证产品合法性
        verifyProduct: (facilityId, locationSeqId, sku, stock,currentSkuList)=> {
            console.log(facilityId, locationSeqId, sku, stock,currentSkuList);
            dispatch(verifyProduct(facilityId, locationSeqId, sku, parseInt(stock),currentSkuList))
        },
        //清空数据
        clearData: ()=> {
            dispatch(clearData(null,1))
        },
        //移库
        multiStockMove: (facilityId, locationSeqId, targetLocationSeqId, productQuantity, selectSkuSize)=> {
            dispatch(multiStockMove(facilityId, locationSeqId, targetLocationSeqId, productQuantity, selectSkuSize))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reservoir);
