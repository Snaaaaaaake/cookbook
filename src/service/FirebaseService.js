import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default class FirebaseService {
    constructor(firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.auth = firebase.auth();
        this.database = firebase.database();
    }

    signUp = (email, password, name) => {
        return this.auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                const user = this.auth.currentUser;
                return user.updateProfile({ displayName: name })
            })
    }

    signIn = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signOut = () => {
        return this.auth.signOut();
    }

    addToFavorites = async (mealId) => {
        const uid = this.auth.currentUser.uid;
        const userFavorites = await this.database.ref(`/users/${uid}/favorites`).once('value')
            .then(data => data.val()) || [];
        const newUniqueArray = [ ...new Set([...userFavorites, mealId]) ];
        return this.database.ref(`/users/${uid}/`).set({ favorites: newUniqueArray});
    }

    removeFromFavorites = async (mealId) => {
        const uid = this.auth.currentUser.uid;
        const userFavorites = await this.database.ref(`/users/${uid}/favorites`).once('value')
            .then(data => data.val()) || [];
        const newUniqueArray = userFavorites.filter(item => item !== mealId);
        return this.database.ref(`/users/${uid}/`).set({ favorites: newUniqueArray});
    }

}