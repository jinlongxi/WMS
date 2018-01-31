/**
 * Created by jinlongxi on 17/11/28.
 */
/**
 * Created by jinlongxi on 17/11/27.
 */
import React, {Component} from 'react';
import Data from './data';
import Header from '../common/header';
import Icon from '../common/icon_enter';
import Reservoir from '../../containers/reservoirContainer';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Button,
    ListView,
    TouchableOpacity,
    Platform,
    BackHandler,
    InteractionManager
} from 'react-native';

class moduleList extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(Data),
        };
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(item) {
        return <TouchableOpacity style={styles.item} onPress={this._selectModule.bind(this, item)}>
            <Text
                style={[{flex: 1,}, styles.txt,]}>{item.text}
            </Text>
            <Icon/>
        </TouchableOpacity>
    };

    _renderSeparator(sectionID, rowID) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 0.5,
                    backgroundColor: '#ddd',
                }}
            />
        );
    }

    //选中模块
    _selectModule(item) {
        if (item.type === 'StockMove') {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'Reservoir',
                    component: Reservoir,
                    params: {
                        selectStore: this.props.selectStore
                    },
                })
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header initObj={{backName: '选择仓库', barTitle: '选择模块'}} {...this.props}/>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
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

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=> {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
                this.props.saveSelectPlaceList(this.props.selectStore.facilityId)
            }
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7a7a7a'
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
    }
});

export default moduleList
