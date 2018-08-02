/**
 * Created by jinlongxi on 18/3/16.
 */
import {
    StyleSheet,
} from 'react-native';
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
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgb(44, 57, 73)',
        paddingVertical: 5,
        paddingHorizontal: 8,
        textAlign: 'center',
        color: '#fff',
    },
    btnContainer: {
        padding: 5,
        flexDirection: 'column',
    },
    position: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    position_btn: {
        flex: 1,
        margin: 2,
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 3,
    },
    position_btn_text: {
        fontSize: 13,
        paddingVertical: 4,
        paddingHorizontal: 5,
        color: '#1d1d1d',
    },

    list: {
        margin: 5,
        backgroundColor: '#ffffff'
    },
    txt: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 14,
        color:'#1d1d1d'
    },
    item: {
        padding: 3,
        backgroundColor: 'white',
        borderWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
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
    uploading: {
        flex: 1,
        backgroundColor: '#F37B22'
    },
    footer_btn_text: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        fontSize: 14,
        color: '#1d1d1d',
        textAlign: 'center'
    },
});

export default styles
