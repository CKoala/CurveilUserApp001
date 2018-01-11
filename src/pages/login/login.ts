import { Component } from '@angular/core';
import { AngularFireAuth, FirebaseAuthStateObservable } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AlertController, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { User } from './../../models/user';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    displayName;
    email;
    profile;
    user_id
    user: Observable<firebase.User>;
    userLogin = {} as User;

    constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController) {
          this.user = afAuth.authState;
        afAuth.authState.subscribe(user => {
            if (!user) {
                this.displayName = null;
                this.email = null;
                this.user_id = null;
                return;
            }
            this.displayName = user.displayName;
            this.email = user.email;
            this.user_id = user.uid;
            console.log(FirebaseAuthStateObservable);
        });
    }
    /*
    //google
    login() {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(function() {
            firebase.auth().getRedirectResult()
            })
    }
    */
    /*signInWithFacebook() {
        this.afAuth.auth
            .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
            .then(res => console.log(res));
    }*/
    signOut() {
        this.afAuth.auth.signOut();
    }
    async emailLogin(user) {
        try {
        const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        console.log(result);
        if (result) {
            // this.navCtrl.setRoot('HomePage');
            console.log("make go home");
        }
    }
    catch (e) {
        console.error(e);
    }
    }
    async emailRegister(user: User) {
        try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
        console.log(result);
    }
    catch (e) {
        console.error(e);
    }
    }
}
