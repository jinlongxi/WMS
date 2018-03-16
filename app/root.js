import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from './store/index';
import AppContainer from './containers/appContainer';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            store: configureStore(()=> {
                this.setState({isLoading: false})
            })
        }
    }

    render() {
        return (
            <Provider store={this.state.store}>
                <AppContainer/>
            </Provider>
        )
    }

}
