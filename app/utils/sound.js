/**
 * Created by jinlongxi on 18/1/23.
 */
const Sound = require('react-native-sound');

Sound.setCategory('Playback', true); // true = mixWithOthers
const Sound_API = {
    // playSoundFromRequire:()=>{
    //     const requireAudio = require('./../../android/app/src/main/res/raw/pass.mp3');
    //     const s = new Sound(requireAudio, (e) => {
    //         if (e) {
    //             console.log('error', e);
    //             return;
    //         }
    //
    //         s.play(() => s.release());
    //     });
    // },
    playSoundBundleSuccess:()=>{
        const s = new Sound('pass.mp3', Sound.MAIN_BUNDLE, (e) => {
            console.log('播放声音');
            if (e) {
                console.log('error', e);
            } else {
                //s.setSpeed(1);
                console.log('duration', s.getDuration());
                s.play(() => s.release()); // Release when it's done so we're not using up resources
            }
        });
    },
    playSoundBundleError:()=>{
        const s = new Sound('error.mp3', Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error', e);
            } else {
                console.log('播放声音');
                //s.setSpeed(1);
                console.log('duration', s.getDuration());
                s.play(() => s.release()); // Release when it's done so we're not using up resources
            }
        });
    }

};

export default Sound_API