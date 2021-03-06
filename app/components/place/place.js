/**
 * Created by jinlongxi on 17/11/27.
 */
/**
 * Created by jinlongxi on 17/9/11.
 */
import React, {Component} from 'react';
import Header from '../../containers/headerBarContainer';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Util from '../../utils/util';
import ModuleContainer from '../../containers/moduleContainer';
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
    InteractionManager,
    Platform,
    BackHandler,
    AppState
} from 'react-native';

class Place extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: null,
            placeList: null,
            isLoading: false
        };
        this.onSelect = this.onSelect.bind(this);
        this._selectModule = this._selectModule.bind(this);
    }

    //当前选中项
    onSelect(index, value) {
        this.setState({
            selectId: value
        })
    }

    render() {
        let placeList = this.state.placeList;
        let isLoading = this.state.isLoading;
        return (
            <View style={styles.container}>
                <Header initObj={{backName: '注销', barTitle: '选择场所', backType: 'logOut'}} {...this.props}/>
                <ScrollView style={styles.form}>
                    <View style={styles.body}>
                        {isLoading ? Util.loading :
                            <RadioGroup
                                onSelect={(index, value) => this.onSelect(index, value)}
                                size={15}
                                style={{marginBottom: 15}}
                            >
                                {
                                    placeList != null ? this.props.placeState.placeList.map((item, index)=> {
                                        return (
                                            <RadioButton value={item} style={styles.radio} key={index}>
                                                <View style={styles.item}>
                                                    <View style={styles.item_left}>
                                                        <Text style={styles.item_h1}>{item.facilityName}</Text>
                                                        <Text style={styles.item_h2}>{item.facilityId}</Text>
                                                    </View>
                                                    <View style={styles.item_right}>
                                                        <Text style={styles.item_h3}>{item.facilityTypeId}</Text>
                                                    </View>
                                                </View>
                                            </RadioButton>
                                        )
                                    }) : null
                                }
                            </RadioGroup>
                        }
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={()=> {
                    this._selectModule()
                }}>
                    <Text style={styles.btn_text}>确定</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //进入选择模块
    _selectModule() {
        if (this.state.selectId != null) {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'ModuleContainer',
                    component: ModuleContainer,
                    params: {
                        selectStore: this.state.selectId,
                    },
                })
            }
        } else {
            alert('请选择仓库')
        }
    }

    //键盘物理返回事件
    onBackAndroid = () => {
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        console.log('监听返回事件' + routers.length);
        if (routers.length > 1) {
            navigator.pop();
            return true;//接管默认行为
        } else {
            return false;//默认行为
        }
    };

    //监听APP运行状态
    _handleAppStateChange = (nextAppState) => {
        console.log('app运行状态' + nextAppState);
        if (nextAppState === 'background') {
            // AppState.exitApp()
        }
    };

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            const {placeActions}=this.props;
            placeActions.getPlaceList()
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            placeList: nextProps.placeState.placeList,
            isLoading: nextProps.placeState.isLoading
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
                AppState.addEventListener('change', this._handleAppStateChange);
            }
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            console.log('卸载掉监听');
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
            AppState.removeEventListener('change', this._handleAppStateChange);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7a7a7a'
    },
    form: {
        backgroundColor: '#ffffff',
        margin: 10
    },
    body: {
        padding: 15
    },
    radio: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Util.windowSize.width * 0.77,
        marginRight: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.55,
        paddingVertical: 10
    },
    item_left: {
        flexDirection: 'column'
    },
    item_right: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70
    },
    item_h1: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    item_h2: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    item_h3: {
        fontSize: 10,
        color: '#999'
    },
    btn: {
        backgroundColor: '#F37B22',
        margin: 10
    },
    btn_text: {
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 2
    }
});

export default Place
