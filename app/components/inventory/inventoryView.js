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
        this.state= {
            loading:this.props.inventoryState.loading,
            dataSource: ds.cloneWithRows([]),
        }
        this._mapList = this._mapList.bind(this)
    }

    _mapList(value){
        let mapvalue = Object.keys(value);
        let mapvalues = [];
        for (let id in mapvalue){
            let v = mapvalue[id];
            if(v.indexOf("_size")<0){
                mapvalues.push(v);
            }
        }
        return(<View style={styles.list}>{this._aa(mapvalues,value)}</View>);
    }

    _aa(mapvalues,value){
        return mapvalues.map((key, index)=> {return(<View style={styles.list}><Text style={styles.item}>{key} ({value[key+'_size']})</Text>{value[key]!=null?this._dd(value[key]):""}</View>)});
    }

    _dd(item){
        return item.map((v1, index)=> {return(
            <View>
                <Text style={styles.item}>{v1.productId}  {v1.quantity}</Text>
                <View
                    style={{
                        height: 0.8,
                        backgroundColor: '#ddd',
                    }}
                />
            </View>
        )});
    }

    render() {
        const {inventoryState,inventoryActions, selectStore}=this.props;
        console.log(inventoryState.loading)
        return (
            <View style={styles.container} >
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
                                    inventoryState.inventoryGroupData != null&&inventoryState.inventoryGroupData.length>0 ? inventoryState.inventoryGroupData.map((value,key)=> {
                                        return (<View>
                                                    <Text style={styles.footer_btn_text}>{inventoryState.locationSeqSize} 个 库位 , {inventoryState.productSectionSize} 款 产品 , {inventoryState.productSize} 件</Text>
                                                    <ListView
                                                        style={styles.list}
                                                        dataSource={this.state.dataSource}
                                                        renderRow={(rowData) => this._mapList(rowData)}
                                                    />
                                                </View>
                                            //<View style={styles.form}>{
                                            //    this._mapList(value)
                                            //}</View>
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
                console.log(this.props)

            });
        }
    //第二个props进来的时候调用
    componentWillReceiveProps(nextProps) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const data = nextProps.inventoryState.inventoryGroupData;
        this.setState({
            loading:nextProps.inventoryState.loading,
            dataSource: ds.cloneWithRows(data)
        });
    }

}

export default InventoryView