/**
 * Created by jinlongxi on 17/11/28.
 */
import React, {Component} from 'react';
import Header from './reservoirHeader';
import Icon from '../common/icon_enter';
import prompt from 'react-native-prompt-android';
import Menu, {MenuItem} from 'react-native-material-menu';
import Util from '../../utils/util';
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
class Reservoir extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selectBtn: 1,
            text: '',
            editable: true,
            selectSkuSize: 0,
            dataSource: ds.cloneWithRows([]),
            currentSkuList: [],
            buttonViewHeight: null,
            buttonHidden: 0
        };


        this._switchBtn = this._switchBtn.bind(this);
        this._clearData = this._clearData.bind(this);
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._isFocused = this._isFocused.bind(this)
    }

    //这个地方太恶心了  是为了挤掉系统键盘后续优化
    menu = null;
    setMenuRef = ref => {
        this.menu = ref;
    };
    hideMenu = () => {
        this.menu.hide();
    };
    showMenu = () => {
        this.menu.show();
    };

    _renderRow(item, sectionID, rowID, highlightRow) {
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
                <Text style={[styles.txt,]}>({parseInt(rowID) + 1}) </Text>
                <Text style={[{flex: 1,}, styles.txt,]}>{item.sku}</Text>
                <Text style={{fontWeight: 'bold'}}>{item.stock}</Text>
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

    //修改扫描SKU数量
    _modifyNumber(item) {
        prompt(
            '修改产品数量',
            item.sku,
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, number, this.state.currentSkuList);
                        this._isFocused()
                    }
                },
                {
                    text: '删除',
                    onPress: () => {
                        this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, 0, this.state.currentSkuList);
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

    //扫描条码
    _scanning(text) {
        switch (this.state.selectBtn) {
            case 1:
                if (text === this.props.reservoirState.targetPositionId) {
                    Alert.alert(
                        '扫描错误',
                        '原位置和目标位置相同',
                        [
                            {text: '确定', onPress: () => console.log('Ask me later pressed')},
                        ],
                        {cancelable: false}
                    );
                    return
                }
                return (
                    this.props.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'current', this.props.placeState.selectPlaceList)
                );
            case 2:
                if (text === this.props.reservoirState.currentPositionId) {
                    Alert.alert(
                        '扫描错误',
                        '原位置和目标位置相同',
                        [
                            {text: '确定', onPress: () => console.log('点击了确定')},
                        ],
                        {cancelable: false}
                    );
                    return
                }
                return (
                    this.props.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'target', this.props.placeState.selectPlaceList)
                );
            case 3:
                let skuList = this.props.reservoirState.selectSkuList;
                let skuStock = 1;
                skuList.map((item)=> {
                    if (item.sku === text)
                        skuStock = parseInt(item.stock) + 1;
                });
                return this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, text, skuStock, this.state.currentSkuList);
        }
    }

    //提交表单
    _submit() {
        const text = this.state.text;
        this.setState({
            text: null
        });
        if (text != null) {
            this._scanning(text);
        }
    }

    //移库操作
    _multiStockMove() {
        if (this.state.selectSkuSize === 0) {
            Alert.alert(
                '移库错误',
                '没有扫到任何商品！',
                [
                    {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
                ],
                {cancelable: false}
            );
            if (this.props.reservoirState.currentPositionId === null) {
                this.setState({
                    selectBtn: 1
                })
            } else {
                this.setState({
                    selectBtn: 3
                })
            }

        } else {
            if (this.props.reservoirState.targetPositionId == null) {
                Alert.alert(
                    '移库错误',
                    '目标库位不能为空!',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                this.setState({
                                    selectBtn: 2
                                })
                            }
                        },
                    ],
                    {cancelable: false}
                );

            } else {
                const JsonArray = [];
                const selectSkuList = this.props.reservoirState.selectSkuList;
                for (let i = 0; i < selectSkuList.length; i++) {
                    JsonArray.push({productId: selectSkuList[i].sku, quantityMoved: selectSkuList[i].stock})
                }
                Alert.alert(
                    '移动(' + this.state.selectSkuSize + ')件',
                    '确定移动' + this.state.selectSkuSize + '件产品从' + this.props.reservoirState.currentPositionId + '到' + this.props.reservoirState.targetPositionId + '?',
                    [
                        {
                            text: '确定',
                            onPress: () => this.props.multiStockMove(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId,
                                this.props.reservoirState.targetPositionId, JsonArray, this.state.selectSkuSize)
                        },
                        {text: '取消', onPress: () => console.log('用户点击了取消清空按钮')},
                    ],
                    {cancelable: false}
                );
            }
        }
    }

    render() {
        return (
            <View style={styles.container} {...this._panResponder.panHandlers} >
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '商品库位移动',
                    barTitle_small: this.props.selectStore.facilityName
                }} {...this.props}/>
                <View style={styles.main}>
                    <View style={[styles.form, {height: this.state.buttonViewHeight}]}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder={this.props.reservoirState.placeholderText}
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
                                    <Text style={styles.position_btn_text}>原位置</Text>
                                    <Text
                                        style={styles.position_btn_text}>{this.props.reservoirState.currentPositionId}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.position_btn, {backgroundColor: this.state.selectBtn === 2 ? '#F37B22' : '#cccccc'}]}
                                    onPress={()=> {
                                        this._switchBtn(2)
                                    }}>
                                    <Text style={styles.position_btn_text}>目标位置</Text>
                                    <Text
                                        style={styles.position_btn_text}>{this.props.reservoirState.targetPositionId}</Text>
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
                        </View>
                    </View>
                    {
                        this.props.reservoirState.selectSkuList.length > 0 ?
                            <ListView
                                style={styles.list}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                renderSeparator={this._renderSeparator}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                            />
                            : null
                    }
                </View>
                <Menu
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity onPress={this.showMenu}>
                        </TouchableOpacity>
                    }
                >
                    <MenuItem onPress={this.hideMenu}>功能一</MenuItem>
                </Menu>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.moving} onPress={()=> {
                        this._multiStockMove()
                    }}>
                        <Text style={styles.footer_btn_text}>移动</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.emptying} onPress={()=> {
                        this._clearData()
                    }}>
                        <Text style={styles.footer_btn_text}>清空</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    //切换功能按钮
    _switchBtn(currentBtn) {
        if (this.props.reservoirState.currentPositionId == null) {
            Alert.alert(
                '原位置不能为空',
                '请先扫描或输入原位置标识',
                [
                    {text: '确定', onPress: () => console.log('用户点击了确定按钮')},
                ],
                {cancelable: false}
            );
        } else {
            this._isFocused();
            this.setState({
                selectBtn: currentBtn,
            })
        }
    }

    //清空数据
    _clearData() {
        Alert.alert(
            '数据清空',
            '您确定要清空？',
            [
                {text: '确定', onPress: () => this.props.clearData()},
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
            that.showMenu();
            that.hideMenu();
        }, 500);
    }

    //键盘物理返回事件
    onBackAndroid = () => {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            navigator.pop();
            return true;//接管默认行为
        }
        return false;//默认行为
    };

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        console.log('键盘弹起了');
    }

    //监听键盘收起事件
    _keyboardDidHide() {
        console.log('键盘收起了');
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                //console.log(evt, gestureState.moveX,gestureState.moveY)
                // gestureState.{x,y}0 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                //console.log('最近一次的移动距离', evt, gestureState.moveX, gestureState.moveY);
                if (gestureState.moveY - this.state.buttonHidden === gestureState.moveY) {
                    this.setState({
                        buttonHidden: gestureState.moveY
                    });
                }
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                console.log(gestureState.moveY - this.state.buttonHidden);
                if (gestureState.moveY - this.state.buttonHidden < -Util.windowSize.height * 0.25) {
                    this.setState({
                        buttonViewHeight: 0,
                        buttonHidden: 0
                    })
                } else if (gestureState.moveY - this.state.buttonHidden > Util.windowSize.height * 0.15) {
                    this.setState({
                        buttonViewHeight: null,
                        buttonHidden: 0
                    })
                } else {
                    this.setState({
                        buttonViewHeight: null,
                        buttonHidden: 0
                    })
                }
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
            }
            //监听键盘弹出事件
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
                this.keyboardDidShowHandler.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            console.log('用户点击返回');
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        //清空数据
        this.props.clearData();
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        const selectSkuSize = nextProps.reservoirState.selectSkuList;
        let number = 0;
        selectSkuSize.map((item)=> {
            number = number + parseInt(item.stock)
        });

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const data = nextProps.reservoirState.selectSkuList;
        this.setState({
            dataSource: ds.cloneWithRows(data),
            selectSkuSize: number,
            selectBtn: nextProps.reservoirState.selectBtn,
            editable: nextProps.reservoirState.editable,
            currentSkuList: nextProps.reservoirState.currentSkuList,
            text: nextProps.reservoirState.text
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
        backgroundColor: '#eeeeee',
        paddingVertical: 10,
        paddingHorizontal: 15
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

export default Reservoir
