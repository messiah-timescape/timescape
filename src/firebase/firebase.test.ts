import {default as FirebaseInit, firebase_auth_test_email_password} from './firebase_init';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const TEST_COLLECTION = 'test';
const TEST_USERID = '074HsYTIkZIjoXuKhDso';

class TestDbActions {
    db: firebase.firestore.Firestore;
    constructor(db: firebase.firestore.Firestore) {
        this.db = db;
    }
    create_test_doc() {
        return this.db.collection(TEST_COLLECTION).add({
            timestamp: new Date()
        });
    }

    list_test_docs() {
        return this.db.collection(TEST_COLLECTION).get();
    }

    list_test_user_doc() {
        return this.db.collection('user').doc(TEST_USERID).get();
    }
}

describe('with authentication', ()=>{
    let actions:TestDbActions;
    let db:FirebaseInit
    beforeAll(async () => {
        db = new FirebaseInit(firebase_auth_test_email_password, 'with_auth');
        actions = new TestDbActions(db.firestore);
        
        await db.wait_for_auth();
    });

    let created_id:string;
    it('can create document', () =>{
        expect.assertions(1);
        return actions.create_test_doc().then(ref => {
            created_id = ref.id;
            expect(ref).toBeDefined();
        }).catch((err:firebase.FirebaseError) => {
            expect(err.code).toBeUndefined();
        });
    });

    afterAll(()=>{
        if ( created_id ) {
            db.firestore.collection(TEST_COLLECTION).doc(created_id).delete();   
        }
    });
    
    it('can list test documents', () =>{
        expect.assertions(1);
        return actions.list_test_docs().then((snapshot)=>{
            let called = false;
            return snapshot.forEach((doc)=>{
                if (!called){
                    called = true;
                    expect(doc).toBeDefined();
                }
            });
        }).catch((err: firebase.FirebaseError) => {
            expect(err.code).toBeUndefined();
        });
    });
    
    it('cannot list other user documents', () =>{
        expect.assertions(1);
        return actions.list_test_user_doc().catch((err: firebase.FirebaseError) => {
            expect(err.code).toBe('permission-denied');
        });
    });
});

describe('without authentication', () => {
    let db:FirebaseInit;
    let actions:TestDbActions;
    beforeAll(() => {
        db = new FirebaseInit(undefined, 'no_auth');
        actions = new TestDbActions(db.firestore);
    });

    it('cannot create document', () =>{
        expect.assertions(1);
        return actions.create_test_doc().catch((err:firebase.FirebaseError) => {
            expect(err.code).toBe('permission-denied');
        });
    });
    
    it('cannot list test documents', () =>{
        expect.assertions(1);
        return actions.list_test_docs().catch((err: firebase.FirebaseError) => {
            expect(err.code).toBe('permission-denied');
        });
    });
});
