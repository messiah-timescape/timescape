import * as fireorm from 'fireorm';
import FirebaseInit from './firebase/firebase_init';

export let firebase_initializer:FirebaseInit;
export default function init_app(auth_fn?:Function):void {
    if (!firebase_initializer){
        firebase_initializer = init_db(auth_fn);
    } else {
        console.warn("Database initialized multiple times");
    }
}

export function init_db(auth_fn?:Function):FirebaseInit {
    let firebase = new FirebaseInit(auth_fn);

    fireorm.initialize(firebase.firestore);

    return firebase;
}