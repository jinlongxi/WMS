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
import VerifyPick from '../../containers/verifyPickContainer';
import StockCollect from '../../containers/collectContainer';
import Util from '../../utils/util';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Button,
    ListView,
    TouchableOpacity,
    Platform,
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
        return (
            <TouchableOpacity style={styles.item} onPress={this._selectModule.bind(this, item)}>
                <Text
                    style={[{flex: 1,}, styles.txt,]}>{item.text}
                </Text>
                <Icon/>
            </TouchableOpacity>
        )
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
        } else if (item.type === 'VerifyPick') {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'VerifyPick',
                    component: VerifyPick,
                    params: {
                        selectStore: this.props.selectStore,
                        pickType: '订单'
                    },
                })
            }
        } else if (item.type === 'VerifyShipmentsPick') {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'VerifyShipmentsPick',
                    component: VerifyPick,
                    params: {
                        selectStore: this.props.selectStore,
                        pickType: '货运'
                    },
                })
            }
        } else if (item.type === 'StockCollect') {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'StockCollect',
                    component: StockCollect,
                    params: {
                        selectStore: this.props.selectStore,
                    },
                })
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header initObj={{backName: '选择仓库', barTitle: '选择模块'}} {...this.props}/>
                {
                    this.props.placeStore.isLoading ? Util.loading : <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        renderSeparator={this._renderSeparator}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                }
            </View>
        );
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(()=> {
            this.props.placeActions.saveSelectPlaceList(this.props.selectStore.facilityId)
        });
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
