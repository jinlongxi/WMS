/**
 * Created by jinlongxi on 17/12/27.
 */
import * as TYPES from '../constants/ActionTypes';

const initialState = {
    productId: null,
    locationSeqId: null,
    loading:false,
    status:null,
    inventoryGroupData:null,
    productSize:0,
    locationSeqSize:0,
    productSectionSize:0
};

export default function inventory(state = initialState, action) {
    switch (action.type) {
        case TYPES.UPDATE_PRODUCT_ID:
            return {
                ...state,
                productId:action.productId
            };
        case TYPES.UPDATE_LOCATION_SEQ_ID:
                    return {
                        ...state,
                        locationSeqId:action.locationSeqId
            };
        case TYPES.INVENTORY_LOADING:
                            return {
                                ...state,
                                loading:action.loading,
                                status:'loading'
                    };
        case TYPES.SAVE_INVENTORY_DATA_SUCCESS:
            console.log("--------type---------")
            console.log(action)
            console.log("--------type---------")
                            return {
                                ...state,
                                inventoryGroupData:action.inventoryGroupData,
                                status:'success',
                                loading:false,
                                productSize:action.productSize,
                                locationSeqSize:action.locationSeqSize,
                                productSectionSize:action.productSectionSize
                    };
        default:
            return state;
    }
}
