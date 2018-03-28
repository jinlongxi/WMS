/**
 * Created by jinlongxi on 18/3/28.
 */
/**
 * Created by jinlongxi on 17/12/1.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as collectCreators from '../actions/collectActions';
import collect from '../components/collect/collect';

const mapStateToProps = (state) => {
    return {
        collectState: state.collectStore,
        placeState: state.placeStore
    }
};

const mapDispatchToProps = (dispatch) => {
    const collectActions = bindActionCreators(collectCreators, dispatch);
    return {
        collectActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(collect);
