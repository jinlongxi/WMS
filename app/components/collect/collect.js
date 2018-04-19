/**
 * Created by jinlongxi on 18/3/28.
 */
/**
 * Created by jinlongxi on 17/11/28.
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
    Platform,
    InteractionManager,
    AlertIOS,
} from 'react-native';
class Collect extends React.Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selectBtn: 1,
            text: '',
            editable: true,
            selectSkuSize: 0,
            dataSource: ds.cloneWithRows([]),
            currentSkuList: [],
            verifySkuList: null,
            buttonViewHeight: null,
            buttonHidden: 0
        };

        this._switchBtn = this._switchBtn.bind(this);
        this._clearData = this._clearData.bind(this);
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._isFocused = this._isFocused.bind(this);
        this._multiStockCollect = this._multiStockCollect.bind(this)
    }

    //修改扫描SKU数量
    _modifyNumber(item) {
        const {collectActions, collectState, selectStore}=this.props;
        prompt(
            item.sku,
            '',
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        collectActions.verifyProduct(selectStore.facilityId, collectState.currentPositionId, item.sku, number, collectState.selectSkuList);
                        this._isFocused()
                    }
                },
                {
                    text: '删除',
                    onPress: () => {
                        collectActions.verifyProduct(selectStore.facilityId, collectState.currentPositionId, item.sku, 0, collectState.selectSkuList);
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
                defaultValue: typeof item.stock === 'number' ? JSON.stringify(item.stock) : item.stock,
                placeholder: '输入数量',
                type: 'numeric'
            }
        );
    }

    //扫描条码 根据按钮位置执行相应操作
    _scanning(text) {
        const {collectActions, placeState, selectStore, collectState}=this.props;
        switch (this.state.selectBtn) {
            case 1:
                return (
                    collectActions.verifyFacilityLocation(selectStore.facilityId, text, 'current', placeState.selectPlaceList)
                );
            case 3:
                let skuList = this.props.collectState.selectSkuList;
                let skuStock = 1;
                skuList.map((item)=> {
                    if (item.sku === text || item.eanId === text) {
                        skuStock = parseInt(item.stock) + 1;
                    }
                });
                return collectActions.verifyProduct(selectStore.facilityId, collectState.currentPositionId, text, skuStock, skuList);
                //return collectActions.findLocationProductMoveRecord(selectStore.facilityId, collectState.currentPositionId, text, skuStock, collectState.currentSkuList);
            case 4:
                return (
                    collectActions.findLocationProductMoveRecord(selectStore.facilityId, text)
                );
        }
        this._isFocused()
    }

    //提交表单
    _submit() {
        const text = this.state.text;
        if (text != null) {
            const {collectActions}=this.props;
            collectActions.loadingWait(true);
            this._scanning(text);
            this.setState({
                text: null
            });
        }
    }

    _renderRow(item, sectionID, rowID, highlightRow) {
        const {sku, stock}=item;
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
                <Text style={styles.txt}>({parseInt(rowID) + 1}) </Text>
                <Text style={[styles.txt, {flex: 1}]}>{sku}</Text>
                <Text style={{fontWeight: 'bold'}}>{stock}</Text>
                <Icon/>
            </TouchableOpacity>
        )
    };


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

    //保存采集数据到服务器
    _multiStockCollect() {
        const {collectState, collectActions, selectStore}=this.props;
        if (this.state.selectSkuSize === 0) {
            Alert.alert(
                '采集错误',
                '没有扫到任何商品！',
                [
                    {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
                ],
                {cancelable: false}
            );
        } else {
            //扫到的SKU 拼接数据
            const JsonArray = [];
            const selectSkuList = this.props.collectState.selectSkuList;
            for (let i = 0; i < selectSkuList.length; i++) {
                JsonArray.push({productId: selectSkuList[i].sku, quantityMoved: selectSkuList[i].stock})
            }
            Alert.alert(
                '采集数据',
                '保存' + this.state.selectSkuSize + '件产品从' + this.props.collectState.currentPositionId + '?',
                [
                    {
                        text: '确定',
                        onPress: () => collectActions.multiStockCollect(selectStore.facilityId, collectState.currentPositionId, JsonArray, this.state.selectSkuSize)
                    },
                    {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
                ],
                {cancelable: false}
            );
        }
    }

    //切换功能按钮
    _switchBtn(currentBtn) {
        const {collectState}=this.props;
        // if (collectState.currentPositionId == null) {
        //     Alert.alert(
        //         '原位置不能为空',
        //         '请先扫描或输入原位置标识',
        //         [
        //             {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
        //         ],
        //         {cancelable: false}
        //     );
        // } else {
            this._isFocused();
            this.setState({
                selectBtn: currentBtn,
            })
        // }
    }

    //清空数据
    _clearData() {
        Alert.alert(
            '数据清空',
            '您确定要清空？',
            [
                {text: '确定', onPress: () => this.props.collectActions.clearData()},
                {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
            ],
            {cancelable: false}
        );
    }

    //文本框获得焦点
    _isFocused() {
        const that = this;
        setTimeout(function () {
            that.refs.aTextInputRef.focus();
        }, 100);
    }

    render() {
        const {collectState, selectStore}=this.props;
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '商品库位采集',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                {
                    collectState.loading ? Util.loading :
                        <View style={styles.main}>
                            <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                                <TextInput style={styles.input}
                                           autoCapitalize='characters'
                                           placeholder={collectState.placeholderText}
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
                                           onBlur={this._isFocused.bind(this)}
                                           ref="aTextInputRef"
                                />
                                <View style={styles.btnContainer}>
                                    <View style={styles.position}>
                                        <TouchableOpacity
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 1 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(1)
                                            }}>
                                            <Text style={styles.position_btn_text}>库位</Text>
                                            <Text
                                                style={styles.position_btn_text}>{collectState.currentPositionId}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.position}>
                                        <TouchableOpacity
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 3 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(3)
                                            }}>
                                            <Text style={styles.position_btn_text}>扫描产品</Text>
                                            <Text
                                                style={styles.position_btn_text}>共{this.state.selectSkuSize}件</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.position}>
                                        <TouchableOpacity
                                            style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 4 ? '#F37B22' : '#cccccc'}]}
                                            onPress={()=> {
                                                this._switchBtn(4)
                                            }}>
                                            <Text style={styles.position_btn_text}>扫描库位中产品</Text>
                                            <Text
                                                style={styles.position_btn_text}></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {
                                collectState.selectSkuList.length > 0 ?
                                    <View style={{flex: 1}}>
                                        <ListView
                                            style={styles.list}
                                            dataSource={this.state.dataSource}
                                            renderRow={this._renderRow}
                                            renderSeparator={this._renderSeparator}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            keyboardShouldPersistTaps='always'
                                        />
                                    </View>
                                    : null
                            }

                        </View>
                }
                {
                    collectState.loading ? null :
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.moving} onPress={()=> {
                                this._multiStockCollect()
                            }}>
                                <Text style={styles.footer_btn_text}>保存</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.emptying} onPress={()=> {
                                this._clearData()
                            }}>
                                <Text style={styles.footer_btn_text}>清空</Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        );
    }

    componentWillMount() {
        // console.log(this.props)
        // const {collectActions}=this.props
        // collectActions.pullData()
    }

    componentWillUnmount() {
        //清空数据
        const {collectActions}=this.props;
        collectActions.clearData();
    }

    componentWillReceiveProps(nextProps) {
        const selectSkuSize = nextProps.collectState.selectSkuList;
        let number = 0;
        selectSkuSize.map((item)=> {
            number = number + parseInt(item.stock)
        });

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const data = nextProps.collectState.selectSkuList;
        this.setState({
            dataSource: ds.cloneWithRows(data),
            selectSkuSize: number,
            selectBtn: nextProps.collectState.selectBtn,
            editable: nextProps.collectState.editable,
            currentSkuList: nextProps.collectState.currentSkuList,
            text: nextProps.collectState.text,
            verifySkuList: nextProps.collectState.verifySkuList
        });
        //需要隐藏键盘调用
        if (nextProps.collectState.status === 'Focused') {
            this._isFocused()
        }
    }
}

export default Collect
