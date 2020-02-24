import firebase from "firebase";

let userlogout = () => {
    return firebase.auth().signOut();
};
export default userlogout;