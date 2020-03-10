import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import check_testing from '../utils/check_testing';

import wait_for_auth from '../utils/wait_auth';

const config = {
    apiKey: "AIzaSyDGmOZPPAAltI95GajKg4djpZIGFvYZWDs",
    authDomain: "messiah-timescape.firebaseapp.com",
    databaseURL: "https://messiah-timescape.firebaseio.com",
    projectId: "messiah-timescape",
    storageBucket: "messiah-timescape.appspot.com",
    messagingSenderId: "293865584542",
    appId: "1:293865584542:web:82954d85d3fdeee5cd888f"
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
        if(!check_testing()) {
            this.firestore.enablePersistence().catch(function(err) {
                if (err.code === 'failed-precondition') {
                    throw new Error('Multiple tabs open, close all others');
                } else if (err.code === 'unimplemented' && process.env.JEST_WORKER_ID === undefined) {
                    throw new Error('I hate your browser');
                }
            });
        }
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