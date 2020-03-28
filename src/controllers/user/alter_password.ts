import firebase from "firebase";

export let forgot_password = (email:string)=> {
    // validate email; make sure it exists in the database
    console.log("Before we try anything.");
    var auth = firebase.auth();
    // are we getting anything from firebase.auth()?
    // console.log(auth.sendPasswordResetEmail);
    return auth.sendPasswordResetEmail(email).then(()=>{
        // email sent
        console.log("Email sent.");
        return true;
    }).catch((error)=> {
        // an error occurred.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        return false;
    });

    console.log("After we try everything.");
}

// export let update_password = (new_password)=> {
//     // let curr_user = CurrentUser.get_loggedin();
//     // curr_user.updatePassword(new_password).then(()=>{
//         // update successful.
//     }).catch((error)=> {
//         console.log(error);
//         // an error occurred.
//     });
// }
