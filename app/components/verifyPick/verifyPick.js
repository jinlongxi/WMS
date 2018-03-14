/**
 * Created by jinlongxi on 18/3/7.
 */
import React, {Component} from 'react';
import Header from '../reservoir/reservoirHeader';
import Icon from '../common/icon_enter';
import Data from './dataPick';
import verifyPickLocationContainer from '../../containers/verifyPickLocationContainer';
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
        this.state = {
            dataSource: ds.cloneWithRows([]),
            text: null,
        };
        this._renderRow = this._renderRow.bind(this)
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {fenjianxiangId, kuwei}=item;
        let isPicked = 0;
        let allPicked = 0;
        for (let a of kuwei) {
            for (let b of Object.values(a)) {
                for (let c of b) {
                    allPicked += c.noPicked;
                    isPicked += c.isPicked
                }
            }
        }
        return (
            <TouchableOpacity style={styles.item}
                              onPress={()=>this._choosePickList(fenjianxiangId)}>
                <Text style={[styles.txt,]}>({parseInt(rowID) + 1}) </Text>
                <Text style={[{flex: 1,}, styles.txt,]}>{fenjianxiangId}</Text>
                <Text style={{fontWeight: 'bold'}}>{isPicked}/{allPicked}</Text>
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
        const {verifyPickStore}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '',
                    barTitle: '订单分拣-选择分拣箱单',
                    barTitle_small: this.props.facilityName
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
                        verifyPickStore.pickList.length > 0 ?
                            <ListView
                                style={styles.list}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                renderHeader={this._renderHeader}
                                renderSeparator={this._renderSeparator}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                            /> : null
                    }
                </View>
            </View>
        );
    }

    //扫描或输入分拣箱单
    _submit() {
        const {verifyPickActions, verifyPickStore}=this.props;
        let selectData = Data.filter((item, index)=> {
            return item.fenjianxiangId === this.state.text
        });
        if (selectData.length > 0) {
            verifyPickActions.addPickList(selectData)
        } else {
            alert('没有这个分拣箱单')
        }
        this.setState({
            text: null
        })
    }

    //进入对应分拣箱单页面
    _choosePickList(fenjianxiangId) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'verifyPickLocationContainer',
                component: verifyPickLocationContainer,
                params: {
                    fenjianxiangId: fenjianxiangId,
                    facilityName: this.props.selectStore.facilityName
                },
            })
        }
    }

    componentWillMount() {
        const {verifyPickStore}=this.props;
        console.log(verifyPickStore);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(verifyPickStore.pickList),
        })
    }

    componentWillReceiveProps(nextProps) {
        const {verifyPickStore}=nextProps;
        console.log(verifyPickStore);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(verifyPickStore.pickList),
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
        alignItems: 'center',
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

export default VerifyPick ;

