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
  portfolios: FirebaseListObservable<any[]>;
  portfolio: FirebaseListObservable<any[]>;
  coins;
  users;
  user_coin;
  users_coins;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.user = afAuth.authState;
    this.library = db.list('/library/');
    this.portfolios = db.list('/portfolio/');
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

      console.log('user_id is '+this.user_id);
      this.portfolio = db.list('/portfolio/'+this.user_id+'/coin_entry/');
      
      this.portfolio.subscribe((obj) => {
        this.user_coin = obj;
        console.log(this.user_coin);
      })
  })

  this.portfolios.subscribe((obj) => {
    this.users_coins = obj;
    console.log(this.users_coins);
  })
    
    this.library.subscribe((obj) => {
      this.coins = obj;
      console.log(this.coins);
    })
   
   
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortfolioPage');
    
  }

}

