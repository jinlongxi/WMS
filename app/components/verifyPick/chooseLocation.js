/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
import Icon from '../common/icon_enter';
import ChooseSkuContainer from '../../containers/verifyPickSkuContainer';
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
class chooseLocation extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {picklistBinId, verifyPickStore, selectStore}=this.props;
        let locationArray = [];
        for (let a of verifyPickStore.picklistLocationArray) {
            if (a.picklistBinId === picklistBinId) {
                locationArray = a.locationArray;
            }
        }
        this.state = {
            dataSource: ds.cloneWithRows(locationArray),
            text: null,
        };
        this._renderRow = this._renderRow.bind(this)
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {location, isPicked, noPicked}=item;
        return (
            <TouchableOpacity style={styles.item} onPress={this._chooseLocation.bind(this, location)}>
                <Text
                    style={[styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>({parseInt(rowID) + 1}) </Text>
                <Text
                    style={[{flex: 1,}, styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>{location}</Text>
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
                <Text style={{fontSize: 13, color: '#1d1d1d'}}>库位号</Text>
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

    //分拣详情信息展示
    _renderPickDetail(verifyPickStore, picklistBinId) {
        let locationArray;
        let noPicked = 0;
        let isPicked = 0;
        for (let a of verifyPickStore.picklistLocationArray) {
            if (a.picklistBinId === picklistBinId) {
                locationArray = a.locationArray;
                console.log(locationArray);
                for (let b of locationArray) {
                    noPicked += b.noPicked;
                    isPicked += b.isPicked
                }
            }
        }

        return (
            <View style={{flexDirection: 'column'}}>
                <View style={{backgroundColor: '#eee', padding: 8}}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#1d1d1d'
                    }}>分拣箱号: {picklistBinId}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#f5f5f5',
                    paddingVertical: 6
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        borderRightColor: '#eee',
                        borderRightWidth: 1
                    }}>
                        <Text style={{color: '#1d1d1d', fontSize: 14}}>库位数总计</Text>
                        <Text style={{
                            color: '#1d1d1d',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>{locationArray.length}</Text>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        borderRightColor: '#eee',
                        borderRightWidth: 1
                    }}>
                        <Text style={{color: '#1d1d1d', fontSize: 14}}>已分拣总计</Text>
                        <Text style={{
                            color: '#1d1d1d',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>{isPicked}</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <Text style={{color: '#1d1d1d', fontSize: 14}}>需分拣总计</Text>
                        <Text style={{
                            color: '#1d1d1d',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>{noPicked}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const {selectStore, verifyPickStore, picklistBinId, verifyPickActions, navigator}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: '订单分拣－选择库位',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                <View style={styles.main}>
                    <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder='扫描或输入库位号'
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
                        verifyPickStore.picklistLocationArray.some((item)=> {
                            return item.picklistBinId === picklistBinId
                        }) ? this._renderPickDetail(verifyPickStore, picklistBinId) : null
                    }
                    {
                        verifyPickStore.picklistLocationArray.some((item)=> {
                            return item.picklistBinId === picklistBinId
                        }) ?
                            <ListView
                                style={styles.list}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                renderHeader={this._renderHeader}
                                renderSeparator={this._renderSeparator}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                            />
                            : Util.loading
                    }

                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving}
                                      onPress={()=>this._completePick.bind(this)()}>
                        <Text style={styles.footer_btn_text}>完成分拣</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.emptying}>
                        <Text style={styles.footer_btn_text}>合并分拣</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    //选中库位进入分拣产品页面
    _chooseLocation(location) {
        const {navigator, verifyPickActions, verifyPickStore, selectStore, picklistBinId,pickType} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseSkuContainer',
                component: ChooseSkuContainer,
                params: {
                    location: location,
                    selectStore,
                    picklistBinId,
                    pickType
                },
            })
        }
    }

    //扫描或输入分拣箱单
    _submit() {
        const {verifyPickStore, picklistBinId}=this.props;
        let hasLocation = false;
        for (let a of verifyPickStore.picklistLocationArray) {
            if (a.picklistBinId === picklistBinId) {
                for (let b of a.locationArray) {
                    if (b.location === this.state.text) {
                        hasLocation = true
                    }
                }
            }
        }
        if (hasLocation) {
            this._chooseLocation(this.state.text)
        } else {
            alert('当前分拣箱中没有这个库位')
        }
        this.setState({
            text: null
        })
    }

    //完成分拣
    _completePick() {
        const {selectStore, verifyPickStore, picklistBinId, verifyPickActions, navigator}=this.props;
        let locationNumber = 0;
        let isPicked = 0;
        let noPicked = 0;
        for (let a of verifyPickStore.picklistLocationArray) {
            if (a.picklistBinId === picklistBinId) {
                locationNumber = a.locationArray.length;
                for (let b of a.locationArray) {
                    isPicked += b.isPicked;
                    noPicked += b.noPicked
                }
            }
        }
        Alert.alert(
            '完成分拣',
            '分拣箱号:' + picklistBinId + '   库位总数:' + locationNumber + '\n' + '已分拣总数:' + isPicked + '   需分拣总数:' + noPicked,
            [
                {
                    text: '确定',
                    onPress: ()=> {
                        navigator.pop();
                        console.log('用户点击了确定按钮');
                        setTimeout(function () {
                            verifyPickActions.completePicked(picklistBinId)
                        }, 1000);
                    }
                },
                {
                    text: '取消',
                    onPress: ()=> {
                        console.log('用户点击了确定按钮');
                    }
                }
            ],
            {cancelable: false}
        );
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            const {picklistBinId, verifyPickStore, verifyPickActions, selectStore,pickType}=this.props;
            let isRequest = verifyPickStore.picklistLocationArray.some((item)=> {
                return item.picklistBinId === picklistBinId
            });
            if (!isRequest) {
                verifyPickActions.getLocationsByPicklistBin(picklistBinId, selectStore.facilityId,pickType)
            }
        });

    }

    componentWillReceiveProps(nextProps) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {picklistBinId, verifyPickStore, selectStore}=nextProps;
        let locationArray;
        for (let a of verifyPickStore.picklistLocationArray) {
            if (a.picklistBinId === picklistBinId) {
                locationArray = a.locationArray;
            }
        }
        if (locationArray) {
            this.setState({
                dataSource: ds.cloneWithRows(locationArray),
            })
        }
    }
}

export default chooseLocation ;
