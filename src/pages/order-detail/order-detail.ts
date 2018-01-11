import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
    selector: 'page-order-detail',
    templateUrl: 'order-detail.html',
})

export class OrderDetail {
    order;
    user: Observable<firebase.User>;
    orders: FirebaseListObservable<any[]>;
    totalarray: FirebaseListObservable<any[]>;
    startstoparray: FirebaseListObservable<any[]>;
    status: FirebaseObjectObservable<any>;
    email;
    profile;
    TaskKey;
    user_id;
    startarray;
    stoparray;
    displayName;
    objectID;
    matchObj;
    total;
    timeStatus;
    secUnits: boolean;
    minUnits: boolean;
    hourUnits: boolean;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {

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
            this.order = navParams.get('order');
            this.orders = db.list('/orders/' + this.user_id);
            this.startstoparray = this.db.list('/startstop/' + this.user_id, {
                query: {
                    orderByChild: 'objectID',
                    equalTo: this.order.$key
                }
            });
            this.startstoparray.subscribe((obj) => {
                this.startarray = obj;
            }
            )
            this.status = db.object('/status/' + this.user_id);
            this.status.subscribe((obj) => {
                this.timeStatus = obj;
                if (this.timeStatus.status === 'minutes') {
                    this.secUnits = false;
                    this.minUnits = true;
                    this.hourUnits = false;
                }
                else if (this.timeStatus.status === 'seconds') {
                    this.secUnits = true;
                    this.minUnits = false;
                    this.hourUnits = false;
                }
                else if (this.timeStatus.status === 'hours') {
                    this.secUnits = false;
                    this.minUnits = false;
                    this.hourUnits = true;
                }
            }
            )
            this.addDifferences()
        });
    }
    secondsTimeUnit() {
        this.status.update({
            status: 'seconds'
        });
    }
    minutesTimeUnit() {
        this.status.update({
            status: 'minutes'
        });
    }
    hoursTimeUnit() {
        this.status.update({
            status: 'hours'
        });
    }
    addDifferences() {
        let sum = 0;
        this.startstoparray.subscribe((obj) => {
            for (let i = 0; i < obj.length; i++) {
                let dif = obj[i].stopTimeunix - obj[i].startTimeunix;
                sum = sum + dif;
            }
            this.total = sum;
        });
    }
    removeStartStop(key: string, start, stop) {
        let confirm = this.alertCtrl.create({
            title: 'Delete this job time keeper?',
            message: 'Permanently remove order from ' + start + ' to ' + stop,
            buttons: [
                {
                    text: 'cancel',
                    handler: () => {
                        console.log('cancel');
                    }
                },
                {
                    text: 'Yes! Delete this order',
                    handler: () => {
                        this.delete(key);
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    }
    delete(key) {
    this.startstoparray.remove(key);
  }
}