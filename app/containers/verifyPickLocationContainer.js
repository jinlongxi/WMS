/**
 * Created by jinlongxi on 18/3/8.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as verifyPickCreators from '../actions/verifyPickAction';
import ChooseLocation from '../components/verifyPick/chooseLocation';
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

const verifyPickLocationContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChooseLocation);
export default verifyPickLocationContainer