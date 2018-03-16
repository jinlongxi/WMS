/**
 * Created by jinlongxi on 18/3/8.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as verifyPickCreators from '../actions/verifyPickAction';
import ChooseSku from '../components/verifyPick/chooseSku';
const mapStateToProps = (state) => {
    const {verifyPickStore} = state;
    return {
        verifyPickStore
    };
};

const mapDispatchToProps = (dispatch)=> {
    const verifyPickActions = bindActionCreators(verifyPickCreators, dispatch);
    return {
        verifyPickActions,
    };
};

const verifyPickSkuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChooseSku);
export default verifyPickSkuContainer