import * as fireorm from 'fireorm';
import FirebaseInit from './firebase/firebase_init';

export function init_app():void {
    let firebase = new FirebaseInit();

    fireorm.initialize(firebase.firestore);
}