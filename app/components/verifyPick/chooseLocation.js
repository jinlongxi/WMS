/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../reservoir/reservoirHeader';
import Icon from '../common/icon_enter';
import ChooseSkuContainer from '../../containers/verifyPickSkuContainer';
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
        this.state = {
            dataSource: ds.cloneWithRows([]),
            text: null,
        };
        this._renderRow = this._renderRow.bind(this)
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        let kuwei;
        let isPicked = 0;
        let allPicked = 0;
        for (let key in item) {
            kuwei = key;
        }
        for (let b of Object.values(item)) {
            for (let c of b) {
                isPicked += c.isPicked;
                allPicked += c.noPicked
            }
        }

        return (
            <TouchableOpacity style={styles.item} onPress={this._chooseLocation.bind(this, item, isPicked, allPicked)}>
                <Text style={[styles.txt,]}>({parseInt(rowID) + 1}) </Text>
                <Text style={[{flex: 1,}, styles.txt,]}>{kuwei}</Text>
                <Text style={{fontWeight: 'bold'}}>{isPicked}/{allPicked}</Text>
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
    _renderPickDetail(verifyPickStore, fenjianxiangId) {
        let locationNumber = 0;
        let isPicked = 0;
        let noPicked = 0;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                locationNumber = a;
                for (let b of a.kuwei) {
                    for (let c of Object.values(b)) {
                        for (let d of c) {
                            isPicked += parseInt(d.isPicked);
                            noPicked += parseInt(d.noPicked);
                        }
                    }
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
                    }}>分拣箱号: {fenjianxiangId}</Text>
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
                        }}>{locationNumber.kuwei ? locationNumber.kuwei.length : 0}</Text>
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
        const {facilityName, verifyPickStore, fenjianxiangId, verifyPickActions, navigator}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: '订单分拣－选择库位',
                    barTitle_small: facilityName
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
                    {this._renderPickDetail(verifyPickStore, fenjianxiangId)}
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
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving}
                                      onPress={()=>this._completePick.bind(this, verifyPickStore, fenjianxiangId, verifyPickActions, navigator)()}>
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
    _chooseLocation(item) {
        const {navigator, verifyPickActions, verifyPickStore, facilityName, fenjianxiangId} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChooseSkuContainer',
                component: ChooseSkuContainer,
                params: {
                    selectLocation: Object.keys(item)[0],
                    facilityName,
                    fenjianxiangId
                },
            })
        }
    }

    //扫描或输入分拣箱单
    _submit() {

    }

    //完成分拣
    _completePick(verifyPickStore, fenjianxiangId, verifyPickActions, navigator) {
        let locationNumber = 0;
        let isPicked = 0;
        let noPicked = 0;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                locationNumber = a;
                for (let b of a.kuwei) {
                    for (let c of Object.values(b)) {
                        for (let d of c) {
                            isPicked += parseInt(d.isPicked);
                            noPicked += parseInt(d.noPicked);
                        }
                    }
                }
            }
        }
        Alert.alert(
            '完成分拣',
            '分拣箱号:' + fenjianxiangId + '   库位总数:' + locationNumber.kuwei.length + '\n' + '已分拣总数:' + isPicked + '   需分拣总数:' + noPicked,
            [
                {
                    text: '确定',
                    onPress: ()=> {
                        navigator.pop();
                        console.log('用户点击了确定按钮');
                        setTimeout(function () {
                            verifyPickActions.completePicked(fenjianxiangId, verifyPickStore.pickList)
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
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {fenjianxiangId, verifyPickStore}=this.props;
        console.log(verifyPickStore)
        let data;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                data = a.kuwei;
            }
        }
        console.log(data);
        this.setState({
            dataSource: ds.cloneWithRows(data),
        })
    }

    componentWillReceiveProps(nextProps) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {fenjianxiangId, verifyPickStore}=nextProps;
        let data;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                data = a.kuwei;
            }
        }
        console.log(data);
        if (data) {
            this.setState({
                dataSource: ds.cloneWithRows(data),
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7a7a7a',
    },
    main: {
        flex: 1
    },
    form: {
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgb(44, 57, 73)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        textAlign: 'center',
        color: '#fff',
    },
    btnContainer: {
        padding: 10,
        flexDirection: 'column',
    },
    position: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    position_btn: {
        flex: 1,
        margin: 5,
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
    },
    position_btn_text: {
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 10,
        color: '#fff'
    },

    list: {
        margin: 10,
        backgroundColor: '#ffffff'
    },
    txt: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 18,
    },
    item: {
        padding: 15,
        backgroundColor: 'white',
        borderWidth: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptying: {
        flex: 1,
        backgroundColor: '#cccccc'
    },
    moving: {
        flex: 1,
        backgroundColor: '#28a745'
    },
    footer_btn_text: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
});

export default chooseLocation ;