/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../reservoir/reservoirHeader';
import Icon from '../common/icon_enter';
import prompt from 'react-native-prompt-android';
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
        const {fenjianxiangId, selectLocation, verifyPickStore}=this.props;
        let data;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                for (let b of a.kuwei) {
                    if (Object.keys(b)[0] === selectLocation) {
                        data = Object.values(b)[0]
                    }
                }
            }
        }
        this.state = {
            dataSource: ds.cloneWithRows(Object.values(data)),
            text: null,
        };
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {sku, noPicked, isPicked}=item;
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
                <Text style={[styles.txt,]}>({parseInt(rowID) + 1}) </Text>
                <Text style={[{flex: 1,}, styles.txt,]}>{sku}</Text>
                <Text style={{fontWeight: 'bold'}}>{isPicked}/{noPicked}</Text>
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

    //分拣详情信息展示
    _renderPickDetail(fenjianxiangId, selectLocation, verifyPickStore) {
        let isPicked = 0;
        let noPicked = 0;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                for (let b of a.kuwei) {
                    if (Object.keys(b)[0] === selectLocation) {
                        for (let c of Object.values(b)[0]) {
                            isPicked += c.isPicked;
                            noPicked += c.noPicked;
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
                    }}>库位号: {selectLocation}</Text>
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
        const {fenjianxiangId, selectLocation, verifyPickStore, facilityName}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: '订单分拣－选择商品',
                    barTitle_small: facilityName
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
                    {this._renderPickDetail(fenjianxiangId, selectLocation, verifyPickStore)}
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

    }

    //修改扫描SKU数量
    _modifyNumber(item) {
        const {selectLocation, verifyPickActions, fenjianxiangId}=this.props;
        prompt(
            '修改产品数量',
            item.sku,
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        verifyPickActions.changeisPicked(fenjianxiangId, selectLocation, item.sku, number, item.noPicked)
                    }
                },
                {
                    text: '删除',
                    onPress: () => {

                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                    }
                },
            ],
            {
                cancelable: false,
                defaultValue: typeof item.isPicked === 'number' ? JSON.stringify(item.isPicked) : item.isPicked,
                placeholder: '输入数量',
                type: 'numeric'
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {fenjianxiangId, selectLocation, verifyPickStore}=nextProps;
        let data;
        for (let a of verifyPickStore.pickList) {
            if (a.fenjianxiangId === fenjianxiangId) {
                for (let b of a.kuwei) {
                    if (Object.keys(b)[0] === selectLocation) {
                        data = Object.values(b)[0]
                    }
                }
            }
        }
        this.setState({
            dataSource: ds.cloneWithRows(Object.values(data)),
        })
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

export default chooseSku ;