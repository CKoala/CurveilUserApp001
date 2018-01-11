import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AlertController, NavController, PopoverController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {
  displayName;
  email;
  user_id;
  user: Observable<firebase.User>;
  newTask;
  library: FirebaseObjectObservable<any>;
  coin;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.user = afAuth.authState;
    this.newTask = false;
    this.library = db.object('/library/');
  
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
  })
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortfolioPage');
    
  }

}

