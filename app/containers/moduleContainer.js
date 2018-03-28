/**
 * Created by jinlongxi on 18/3/26.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as placeCreators from '../actions/placeAction';
import ModuleList from '../components/module/moduleList';

const mapStateToProps = (state) => {
    const {placeStore}=state;
    return {
        placeStore
    }
};

const mapDispatchToProps = (dispatch) => {
    const placeActions = bindActionCreators(placeCreators, dispatch);
    return {
        placeActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleList);
