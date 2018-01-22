import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AlertController, NavController, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html',
})
export class PortfolioPage {
  displayName;
  email;
  user_id;
  user: Observable<firebase.User>;
  newTask;

  library: FirebaseListObservable<any[]>;
  portfolio: FirebaseListObservable<any[]>;
  coins;
  users;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.user = afAuth.authState;
    this.library = db.list('/library/');
    this.portfolio = db.list('/portfolio/'+this.user_id);
    this.library.subscribe((obj) => {
      this.coins = obj;
    })

    this.portfolio.subscribe((obj) => {
      this.users = obj;
    })
  
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

