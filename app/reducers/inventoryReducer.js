/**
 * Created by jinlongxi on 17/12/27.
 */
import * as TYPES from '../constants/ActionTypes';

const initialState = {
    productId: null,//商品id
    locationSeqId: null,//库位
    loading:false,//是否有loading画面
    status:null,//状态（'success','loading'）
    inventoryGroupData:[],//库位中商品数据
    productSize:0,//商品数量
    locationSeqSize:0,//库位数量
    productSectionSize:0,//商品款式数量
    selectBtn: 1,//第几个框
};

export default function inventory(state = initialState, action) {
    switch (action.type) {
        case TYPES.UPDATE_PRODUCT_ID:
            return {
                ...state,
                productId:action.productId,
                selectBtn: 2
            };
        case TYPES.UPDATE_LOCATION_SEQ_ID:
            return {
                ...state,
                locationSeqId:action.locationSeqId,
                selectBtn: 2
            };
        case TYPES.INVENTORY_LOADING:
            return {
                ...state,
                loading:action.loading,
                status:'loading'
            };
        case TYPES.SAVE_INVENTORY_DATA_SUCCESS:
            return {
                ...state,
                inventoryGroupData:action.inventoryGroupData,
                status:'success',
                loading:false,
                productSize:action.productSize,
                locationSeqSize:action.locationSeqSize,
                productSectionSize:action.productSectionSize,
                selectBtn: 1
            };
        case TYPES.CLEAN_PRODUCT_LOCATION_DATA:
            return {
                ...state,
                productId:'',
                locationSeqId:'',
                selectBtn: 1
            };
        default:
            return state;
    }
}
