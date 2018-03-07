import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import reservoirReducer from './reservoirReducer';
import placeReducer from './placeReducer';
import verifyPickReducer from './verifyPickReducer'

export default combineReducers({
    loginStore: loginReducer,
    reservoirStore: reservoirReducer,
    placeStore: placeReducer,
    verifyPickStore:verifyPickReducer
});
