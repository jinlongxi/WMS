/**
 * Created by jinlongxi on 17/8/22.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,       //获取设备的宽高
    ActivityIndicator //相当于Loading加载
} from 'react-native';

const Request = {

    //POST请求
    postRequest: function (url, data, successCallback, failCallback) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })
            .then((response)=>response.json())
            .then((responseData)=>successCallback(responseData))
            .catch((error)=>failCallback(error))
    },
};

export default Request
