/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
import Icon from '../common/icon_enter';
import Data from './dataPick';
import verifyPickLocationContainer from '../../containers/verifyPickLocationContainer';
import Util from '../../utils/util';
import styles from '../../styles/verifyPickStyles';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    NavigatorIOS,
    ScrollView,
    Alert,
    Switch,
    ListView,
    KeyboardAvoidingView,
    BackHandler,
    Platform,
    Keyboard,
    InteractionManager,
    AlertIOS,
    PanResponder
} from 'react-native';
class VerifyPick extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {verifyPickStore}=this.props;
        this.state = {
            dataSource: ds.cloneWithRows(verifyPickStore.picklistArray),
            text: null,
        };
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {picklistBinId, noPicked, isPicked}=item;
        return (
            <TouchableOpacity style={styles.item}
                              onPress={()=>this._choosePickList(picklistBinId)}>
                <Text
                    style={[styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>({parseInt(rowID) + 1}) </Text>
                <Text
                    style={[{flex: 1,}, styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>{picklistBinId}</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Util.distinguishColor(isPicked, noPicked)
                }}>{isPicked}/{noPicked}</Text>
                <Icon/>
            </TouchableOpacity>
        )
    };

    _renderHeader() {
        return (
            <View style={[styles.item, {justifyContent: 'space-between', backgroundColor: '#eee'}]}>
                <Text style={{fontSize: 13, color: '#1d1d1d'}}>分拣未结束箱单</Text>
                <Text style={{fontSize: 13, color: '#1d1d1d'}}>已分拣/需分拣</Text>
            </View>
        )
    }

    _renderSeparator(sectionID, rowID) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 0.8,
                    backgroundColor: '#ddd',
                }}
            />
        );
    }

    render() {
        const {verifyPickStore, selectStore,pickType}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: pickType+'分拣-选择分拣箱单',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                <View style={styles.main}>
                    <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder='扫描/输入分拣箱单号'
                                   placeholderTextColor="#7a7a7a"
                                   underlineColorAndroid='transparent'
                                   returnKeyLabel="完成"
                                   keyboardType="default"
                                   autoFocus={true}
                                   editable={this.state.editable}
                                   multiline={false}
                                   value={this.state.text}
                                   onChangeText={(text)=> {
                                       this.setState({
                                           text: text
                                       })
                                   }}
                                   onEndEditing={(text)=> {
                                   }}
                                   onSubmitEditing={()=> {
                                       this._submit()
                                   }}
                                   ref="aTextInputRef"
                        />
                    </View>
                    {
                        verifyPickStore.picklistArray.length > 0 ?
                            <ListView
                                style={styles.list}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                renderHeader={this._renderHeader}
                                renderSeparator={this._renderSeparator}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                            /> : Util.loading
                    }
                </View>
            </View>
        );
    }

    //扫描或输入分拣箱单
    _submit() {
        const {verifyPickStore}=this.props;
        let selectData = verifyPickStore.picklistArray.filter((item, index)=> {
            return item.picklistBinId === this.state.text
        });
        if (selectData.length > 0) {
            this._choosePickList(this.state.text)
        } else {
            alert('没有这个分拣箱单')
        }
        this.setState({
            text: null
        })
    }

    //进入对应分拣箱单页面
    _choosePickList(picklistBinId) {
        const {navigator, selectStore,pickType} = this.props;
        if (navigator) {
            navigator.push({
                name: 'verifyPickLocationContainer',
                component: verifyPickLocationContainer,
                params: {
                    picklistBinId: picklistBinId,
                    selectStore: selectStore,
                    pickType:pickType
                },
            })
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            const {verifyPickStore, selectStore, verifyPickActions,pickType}=this.props;
            verifyPickActions.getPicklistBinByFacility(selectStore.facilityId,pickType);
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataSource: ds.cloneWithRows(verifyPickStore.picklistArray),
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        const {verifyPickStore}=nextProps;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(verifyPickStore.picklistArray),
        })
    }
}

export default VerifyPick ;

