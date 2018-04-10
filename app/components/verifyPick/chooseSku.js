/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
import Icon from '../common/icon_enter';
import prompt from 'react-native-prompt-android';
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
class chooseSku extends React.Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {picklistBinId, verifyPickStore, location}=this.props;
        let SkuArray = [];
        for (let a of verifyPickStore.picklistLocationSkuArray) {
            if (a.locationSeqId === location && a.picklistBinId === picklistBinId) {
                SkuArray = a.SkuArray;
            }
        }
        this.state = {
            dataSource: ds.cloneWithRows(SkuArray),
            text: null,
        };
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._isFocused = this._isFocused.bind(this);
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {SKU, noPicked, isPicked}=item;
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
                <Text
                    style={[styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>({parseInt(rowID) + 1}) </Text>
                <Text style={[{flex: 1,}, styles.txt, {color: Util.distinguishColor(isPicked, noPicked)}]}>{SKU}</Text>
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
                <Text style={{fontSize: 13, color: '#1d1d1d'}}>SKU</Text>
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

    //文本框获得焦点
    _isFocused() {
        const that = this;
        setTimeout(function () {
            that.refs.aTextInputRef.focus();
        }, 100);
    }

    //分拣详情信息展示
    _renderPickDetail(location, verifyPickStore, picklistBinId) {
        let isPicked = 0;
        let noPicked = 0;
        for (let a of verifyPickStore.picklistLocationSkuArray) {
            if (a.locationSeqId === location && a.picklistBinId === picklistBinId) {
                for (let b of a.SkuArray) {
                    isPicked += b.isPicked;
                    noPicked += b.noPicked;
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
                    }}>库位号: {location}</Text>
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
        const {selectLocation, verifyPickStore, selectStore, location, picklistBinId,pickType}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: pickType+'分拣－选择商品',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                <View style={styles.main}>
                    <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder='扫描或输入SKU'
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
                        verifyPickStore.picklistLocationSkuArray.some((item)=> {
                            return item.locationSeqId === location && item.picklistBinId === picklistBinId;
                        }) ? this._renderPickDetail(location, verifyPickStore, picklistBinId) : null
                    }
                    {
                        verifyPickStore.picklistLocationSkuArray.some((item)=> {
                            return item.locationSeqId === location && item.picklistBinId === picklistBinId
                        }) ? <ListView
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
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving} onPress={()=> {
                        this.props.navigator.pop()
                    }}>
                        <Text style={styles.footer_btn_text}>选择其他库位</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    //扫描或输入分拣箱单
    _submit() {
        if (this.state.text) {
            const {verifyPickStore, picklistBinId, location, verifyPickActions}=this.props;
            let hasSku = false;
            let currentSelectSku;
            for (let a of verifyPickStore.picklistLocationSkuArray) {
                if (a.picklistBinId === picklistBinId && a.locationSeqId === location) {
                    for (let b of a.SkuArray) {
                        if (b.SKU === this.state.text || b.EAN === this.state.text) {
                            hasSku = true;
                            currentSelectSku = b
                        }
                    }
                }
            }
            if (hasSku) {
                verifyPickActions.changeisPicked(picklistBinId, currentSelectSku.locationSeqId, currentSelectSku.SKU, currentSelectSku.isPicked + 1, currentSelectSku.isPicked);
            } else {
                Alert.alert(
                    'SKU:' + this.state.text,
                    '当前库位中没有这个SKU',
                    [
                        {
                            text: '确定',
                            onPress: ()=> {
                                this._isFocused()
                            }
                        },
                    ],
                    {cancelable: false}
                );
                this._isFocused()
            }
            this.setState({
                text: null
            });
        } else {
            this._isFocused()
        }
    }

    //修改扫描SKU数量
    _modifyNumber(item) {
        const {SKU, locationSeqId, noPicked, isPicked}=item;
        const {selectStore, verifyPickActions, picklistBinId}=this.props;
        prompt(
            '修改产品数量',
            'SKU: ' + SKU,
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        if (number) {
                            verifyPickActions.changeisPicked(picklistBinId, locationSeqId, SKU, parseInt(number), isPicked);
                        }
                        this._isFocused()
                    }
                },
                {
                    text: '完成',
                    onPress: (number) => {
                        verifyPickActions.changeisPicked(picklistBinId, locationSeqId, SKU, noPicked, isPicked);
                        this._isFocused()
                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                        this._isFocused()
                    }
                },
            ],
            {
                cancelable: false,
                defaultValue: item.isPicked === 0 ? null : item.isPicked.toString(),
                placeholder: '输入数量',
                type: 'numeric'
            }
        );
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            const {location, selectStore, verifyPickStore, verifyPickActions, picklistBinId, pickType}=this.props;
            let isRequest = verifyPickStore.picklistLocationSkuArray.some((item)=> {
                return item.picklistBinId === picklistBinId && item.locationSeqId === location;
            });
            if (!isRequest) {
                verifyPickActions.getSKUListByLocationSeqId(picklistBinId, selectStore.facilityId, location, pickType);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const {picklistBinId, verifyPickStore, location}=nextProps;
        let SkuArray = [];
        console.log(verifyPickStore.picklistLocationSkuArray);
        for (let a of verifyPickStore.picklistLocationSkuArray) {
            console.log(a);
            if (a.locationSeqId === location && a.picklistBinId === picklistBinId) {
                SkuArray = a.SkuArray;
            }
        }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(SkuArray),
        })
    }
}

export default chooseSku ;
