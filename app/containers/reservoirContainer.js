/**
 * Created by jinlongxi on 17/12/1.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reservoirCreators from '../actions/reservoirAction';
import Reservoir from '../components/reservoir/reservoir';

const mapStateToProps = (state) => {
    return {
        reservoirState: state.reservoirStore,
        placeState: state.placeStore
    }
};

const mapDispatchToProps = (dispatch) => {
    const reservoirActions = bindActionCreators(reservoirCreators, dispatch);
    return {
        reservoirActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reservoir);
