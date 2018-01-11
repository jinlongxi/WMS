/**
 * Created by jinlongxi on 17/11/28.
 */
import React, {Component} from 'react';
import Header from './reservoirHeader';
import Icon from '../common/icon_enter';
import prompt from 'react-native-prompt-android';
import Menu, {MenuItem} from 'react-native-material-menu';
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
    AlertIOS
} from 'react-native';
class Reservoir extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selectBtn: 1,
            text: '',
            selectSkuSize: 0,
            dataSource: ds.cloneWithRows([]),
        };
        this._switchBtn = this._switchBtn.bind(this);
        this._clearData = this._clearData.bind(this);
        this._modifyNumber = this._modifyNumber.bind(this);
        this._renderRow = this._renderRow.bind(this);
    }

    //这个地方太恶心了  是为了把系统键盘拿掉
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

    _renderRow(item) {
        return (
            <TouchableOpacity style={styles.item} onPress={this._modifyNumber.bind(this, item)}>
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
        this.showMenu();
        this.hideMenu();
        prompt(
            '修改产品数量',
            item.sku,
            [
                {
                    text: '确定',
                    onPress: (number) => {
                        this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, number);
                        this._isFocused()
                    }
                },
                {
                    text: '删除',
                    onPress: () => {
                        this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, item.sku, 0);
                        this._isFocused()
                    }
                },
                {
                    text: '取消',
                    onPress: () => {
                        console.log('Cancel Pressed');
                        this._isFocused()
                    }
                },
            ],
            {
                cancelable: false,
                defaultValue: typeof item.stock === 'number' ? JSON.stringify(item.stock) : item.stock,
                placeholder: '输入数量'
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
                console.log('验证当前库位合法性');
                return (
                    this.props.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'current')
                );
            case 2:
                if (text === this.props.reservoirState.currentPositionId) {
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
                console.log('验证目标库位合法性');
                return (
                    this.props.verifyFacilityLocation(this.props.selectStore.facilityId, text, 'target')
                );
            case 3:
                console.log('验证产品合法性');
                let skuList = this.props.reservoirState.selectSkuList;
                let skuStock = 1;
                skuList.map((item)=> {
                    if (item.sku === text)
                        skuStock = parseInt(item.stock) + 1;
                });
                return this.props.verifyProduct(this.props.selectStore.facilityId, this.props.reservoirState.currentPositionId, text, skuStock);
        }
    }

    //移库操作
    _multiStockMove() {
        console.log('移库操作');
        const JsonArray = [];
        const selectSkuList = this.props.reservoirState.selectSkuList;
        for (let i = 0; i < selectSkuList.length; i++) {
            JsonArray.push({productId: selectSkuList[i].sku, quantityMoved: selectSkuList[i].stock})
        }
        Alert.alert(
            '移库操作',
            '您确定要移动？',
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

    render() {
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '商品库位移动',
                    barTitle_small: this.props.selectStore.facilityName
                }} {...this.props}/>
                <View style={styles.main}>
                    <View style={styles.form}>
                        <TextInput style={styles.input}
                                   autoCapitalize='characters'
                                   placeholder={this.props.reservoirState.placeholderText}
                                   underlineColorAndroid='transparent'
                                   returnKeyLabel="完成"
                                   keyboardType="numbers-and-punctuation"
                                   autoFocus={true}
                                   editable={true}
                                   value={this.state.text}
                                   onChangeText={this._scanning.bind(this)}
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
                            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={this._renderRow}
                                    renderSeparator={this._renderSeparator}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </ScrollView>
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
        this._isFocused();
        this.setState({
            selectBtn: currentBtn,
        })
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
        this.refs.aTextInputRef.focus()
    }

    //键盘物理返回事件
    onBackAndroid = () => {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        console.log('当前路由长度：' + routers.length);
        if (routers.length > 1) {
            navigator.pop();
            return true;//接管默认行为
        }
        return false;//默认行为
    };

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        this.showMenu();
        this.hideMenu();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
            }
            //监听键盘弹出事件
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
                this.keyboardDidShowHandler.bind(this));
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
        }
    }

    componentWillReceiveProps(nextProps) {
        const selectSkuSize = nextProps.reservoirState.selectSkuList;
        console.log(nextProps.reservoirState.selectSkuList.length);
        let number = 0;
        selectSkuSize.map((item)=> {
            number = number + parseInt(item.stock)
        });
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(nextProps.reservoirState.selectSkuList),
            selectSkuSize: number
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
        flexDirection: 'column'
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
