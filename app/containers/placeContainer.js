/**
 * Created by jinlongxi on 17/12/27.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Place from '../components/place/place';
import {bindActionCreators} from 'redux';
import * as placeCreators from '../actions/placeAction';

const mapStateToProps = (state) => {
    return {
        placeState: state.placeStore
    }
};
const mapDispatchToProps = (dispatch) => {
    const placeActions = bindActionCreators(placeCreators, dispatch);
    return {
        placeActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Place);
