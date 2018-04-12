/**
 * Created by jinlongxi on 17/11/28.
 */
import React, {Component} from 'react';
import Header from '../common/reservoirHeader';
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
class InventoryView extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            loading: this.props.inventoryState.loading,
            dataSource: ds.cloneWithRows([]),
        }
        this._mapList = this._mapList.bind(this)
    }

    //第一层这里遍历出所有库位信息，然后放入第二层
    _mapList(value) {
        let mapvalue = Object.keys(value);
        let locationSeqList = [];
        for (let id in mapvalue) {
            let v = mapvalue[id];
            if (v.indexOf("_size") < 0) {
                locationSeqList.push(v);
            }
        }
        return (<View style={styles.list}>{this._locationList(locationSeqList, value)}</View>);
    }

    //第二层库位信息，创建出库位号和库位的所有商品数量，进入第三层
    _locationList(locationSeqList, value) {
        return locationSeqList.map((locationSeq, index)=> {
            return (<View style={styles.list} key={index}><Text style={styles.item}>{locationSeq}
                ({value[locationSeq + '_size']})</Text>{value[locationSeq] != null ? this._productList(value[locationSeq]) : ""}</View>)
        });
    }

    //第三层商品信息，创建出商品id和数量
    _productList(inventoryItemList) {
        return inventoryItemList.map((inventoryItem, index)=> {
            return (
                <View key={index}>
                    <Text style={styles.item}>{inventoryItem.productId} {inventoryItem.quantity}</Text>
                    <View
                        style={{
                            height: 0.8,
                            backgroundColor: '#ddd',
                        }}
                    />
                </View>
            )
        });
    }

    render() {
        const {inventoryState, selectStore}=this.props;
        //console.log(inventoryState.loading)
        return (
            <View style={styles.container}>
                <Header initObj={{
                    backName: '选择模块',
                    barTitle: '库存查询',
                    barTitle_small: selectStore.facilityName
                }} {...this.props}/>
                <View>
                    {
                        this.state.loading ? Util.loading :
                            <View style={styles.form}>
                                {
                                    inventoryState.inventoryGroupData != null && inventoryState.inventoryGroupData.length > 0 ? inventoryState.inventoryGroupData.map((value, key)=> {
                                        return (<View key={key}>
                                                <Text style={styles.footer_btn_text}>{inventoryState.locationSeqSize} 个
                                                    库位 , {inventoryState.productSectionSize} 款 产品
                                                    , {inventoryState.productSize} 件</Text>
                                                <ListView
                                                    style={styles.list}
                                                    dataSource={this.state.dataSource}
                                                    renderRow={(rowData) => this._mapList(rowData)}
                                                />
                                            </View>
                                        )
                                    }) : <Text>{JSON.stringify(inventoryState.inventoryGroupData)}</Text>

                                }
                            </View>

                    }
                </View>
            </View>
        );
    }

    //进入之前
    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            //当进入显示页面，把查询页面的条件清空
            this.props.inventoryActions.clearData();
            //console.log(this.props)
        });
    }

    //第二个props进来的时候调用
    componentWillReceiveProps(nextProps) {
        //初始化<ListView>列表的数据
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const data = nextProps.inventoryState.inventoryGroupData;
        this.setState({
            loading: nextProps.inventoryState.loading,
            dataSource: ds.cloneWithRows(data)
        });
    }

}

export default InventoryView
