/**
 * Created by jinlongxi on 17/12/1.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inventoryCreators from '../actions/inventoryAction';
import Inventory from '../components/inventory/inventory';

const mapStateToProps = (state) => {
    return {
        inventoryState: state.inventoryStore,
        placeState: state.placeStore
    }
};

const mapDispatchToProps = (dispatch) => {
    const inventoryActions = bindActionCreators(inventoryCreators, dispatch);
    return {
        inventoryActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
