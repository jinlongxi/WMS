/**
 * Created by jinlongxi on 17/12/27.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Place from '../components/place/place';
import {getPlaceList} from '../actions/placeAction';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

const mapStateToProps = (state) => {
    return {
        placeState: state.placeStore
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        //查询场所列表
        getPlaceList:()=>{
            dispatch(getPlaceList())
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Place);
