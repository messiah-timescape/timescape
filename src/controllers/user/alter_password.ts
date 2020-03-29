import firebase from "firebase";

export let forgot_password = (email:string)=> {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email).then(()=>{
        // email sent
        return true;
    }).catch((error)=> {
        // an error occurred.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        return false;
    });
}
