import FirebaseInit from './firebase_init';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

it('successfully creates test document', () =>{
    FirebaseInit();
    const firestore = firebase.firestore();
    firestore.collection('test').add({
        timestamp: new Date()
    });
});