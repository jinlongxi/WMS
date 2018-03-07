/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as verifyPickCreators from '../actions/verifyPickAction';
import VerifyPick from '../components/verifyPick/verifyPick';
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

const verifyPickContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyPick);
export default verifyPickContainer