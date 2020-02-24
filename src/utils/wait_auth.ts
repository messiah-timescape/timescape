import firebase from 'firebase/app';

let wait_for_auth = (db?:any) =>{
    return new Promise((resolve, reject) => {
        if(!db){
            db = firebase;
        }
        db.auth().onAuthStateChanged((data)=>{
            if( data ){
                resolve(data);
            }
        });
    });
};

export default wait_for_auth;