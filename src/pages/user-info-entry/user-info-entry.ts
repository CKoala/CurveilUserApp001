import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AlertController, NavController, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-userEntry',
  templateUrl: 'user-info-entry.html',
})
export class UserEntryPage {
  displayName;
  email;
  user_id;
  user: Observable<firebase.User>;
  newTask;
  user_data: FirebaseObjectObservable<any>;
  library: FirebaseListObservable<any[]>;
  portfolio: FirebaseListObservable<any[]>;
  coins;
  users;


  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
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
      this.library = db.list('/library/');
      this.portfolio = db.list('/portfolio/' + this.user_id);
      this.user_data = db.object('/portfolio/' + this.user_id);
      this.library.subscribe((obj) => {
      this.coins = obj;
    })

    this.portfolio.subscribe((obj) => {
      this.users = obj;
    })
  })
  
}
updateUser(name, coin_code, quantity_of_coins) {
  let coin_exists = true;
  console.log(this.user_id);
    // check coin code exists in the library
    // if exists
  if (coin_exists === true) {
    let coin_entry = {};
    console.log(coin_code + quantity_of_coins)
    coin_entry[coin_code] = {
      quantity: quantity_of_coins
    }
    let idobj = {
      name: name,
      coin_entry     
    };
    console.log(idobj);
    this.user_data.update(idobj);
    
  } else {
    // let message = "coin code is not part of Curveil library, please enter a valid code"
  }
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEntryPages');
    
  }

}

