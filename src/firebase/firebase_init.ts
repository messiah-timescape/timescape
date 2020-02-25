import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import wait_for_auth from '../utils/wait_auth';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID
};

const auth_user = {
    email: process.env.REACT_APP_FIREBASE_TEST_AUTH_EMAIL,
    password: process.env.REACT_APP_FIREBASE_TEST_AUTH_PWD
}

export function firebase_auth_test_email_password(auth:any){
    if (!(auth_user.email && auth_user.password)){
        throw new Error('Set REACT_APP_FIREBASE_AUTH_EMAIL and REACT_APP_FIREBASE_AUTH_PWD in .env.development.local'
            + ' for testing purposes');
    }
    return auth.signInWithEmailAndPassword(auth_user.email, auth_user.password);
}

export default class FirebaseInit{
    firestore:firebase.firestore.Firestore;
    db:firebase.app.App;
    constructor(auth_method?:Function, name?:string){
    
        this.db = firebase.initializeApp(config, name);
        this.firestore = this.db.firestore();
        this.firestore.settings({
            timestampsInSnapshots: true
        });
        if (auth_method) {
            this.authenticate(auth_method);
        }
    }

    authenticate(auth_method:Function):Promise<any>{
        return auth_method(this.db.auth()).catch(function(error:any) {
            throw new Error('Failed firebase login');
        });
    }

    
    wait_for_auth(){
        return wait_for_auth(this.db);
    }

}