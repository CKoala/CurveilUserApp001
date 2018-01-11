import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AlertController, NavController, PopoverController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newTaskID: string = '';
  startTrigger = true;
  orders: FirebaseListObservable<any[]>;
  startstoparray: FirebaseObjectObservable<any>;
  startstoparraylist: FirebaseListObservable<any[]>;
  order: FirebaseObjectObservable<any>;
  status: FirebaseObjectObservable<any>;
  totalarray: FirebaseListObservable<any[]>;
  displayName;
  email;
  profile;
  user_id;
  uid;
  secUnits: boolean;
  minUnits: boolean;
  hourUnits: boolean;
  newTask: boolean;
  user: Observable<firebase.User>;
  TaskKey;
  $key: any[];
  total;
  testRadioOpen;
  testRadioResult;
  timeStatus;


  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.user = afAuth.authState;
    this.newTask = false;
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
      // console.log(FirebaseAuthStateObservable);
      this.startstoparraylist = db.list('/startstop/' + this.user_id);
      this.orders = db.list('/orders/' + this.user_id);
      this.order = db.object('/orders/' + this.user_id);
      this.status = db.object('/status/' + this.user_id);
      this.orders.subscribe((obj) => {
        this.TaskKey = obj;
      }
      )
      this.status.subscribe((obj) => {
        this.timeStatus = obj;
          if (this.timeStatus.status === 'minutes')  {
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
  startstopTrigger(objectkey, triggerState, Identifier, totalexists) {
    let timeInMs = Date.now();
    var stored = JSON.parse(localStorage.getItem(objectkey));
    if (triggerState === true) {
      let idobj = {};
      idobj[objectkey] = {
        TaskIdentifier: Identifier,
        TriggerState: false,
        Total: totalexists
      };
      this.order.update(idobj);
      let localobj = {
        startTime: moment().format('LTS'),
        startTimeunix: timeInMs
      };
      localStorage.setItem(objectkey, JSON.stringify(localobj));
      console.log("local storage" + localStorage);
      // next lin aabove the if
      // var stored = JSON.parse(localStorage.getItem(objectkey));
      console.log("stored start time" + stored.startTime);

    } else {
      let localobj = {
        objectID: objectkey,
        startTime: stored.startTime,
        startTimeunix: stored.startTimeunix,
        stopTime: moment().format('LTS'),
        stopTimeunix: timeInMs
      };
      localStorage.setItem(objectkey, JSON.stringify(localobj));
      console.log("push local obj " + localobj);
      var difference = timeInMs - stored.startTimeunix;
      let totalvalue = this.total + difference
      let idobj = {};
      idobj[objectkey] = {
        TaskIdentifier: Identifier,
        TriggerState: true,
        Total: totalvalue
      };
      this.addDifferences(objectkey);
      // may not the second load of local storage objects
      this.order.update(idobj);
      this.startstoparraylist.push(localobj);
    }
  }

  taskInput() {
    if (this.newTask === false) {
      this.newTask = true;
    } else {
      this.newTask = false;
    }
  }
  submitTaskID(newTaskID) {
    this.taskInput();
    this.orders.push({
      TaskIdentifier: newTaskID,
      TriggerState: true,
      Total: 0
    });
    this.newTaskID = '';
  }
  openOrder(order) {
    this.navCtrl.push('OrderDetail',
      { order: order });
  }

  delete(key: string) {
    this.orders.remove(key);
    this.deleteTimeList(key);
    //remove start stop lists too
  }
  deleteTimeList(key) {
    this.totalarray = this.db.list('/startstop/' + this.user_id, {
      query: {
        orderByChild: 'objectID',
        equalTo: key
      }
    });
    this.totalarray.subscribe((obj) => {
      for (let i = 0; i < obj.length; i++) {
        this.startstoparraylist.remove(obj[i].$key);
      }
    });
  }
  showConfirm(key: string, TaskIdentifier: string) {
    let confirm = this.alertCtrl.create({
      title: 'Delete this job code?',
      message: 'Permanently remove ' + TaskIdentifier + '?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            // console.log('cancel');
          }
        },
        {
          text: 'Yes! Delete ' + TaskIdentifier + '!',
          handler: () => {
            this.delete(key);
            // console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  addDifferences(objectkey) {
    let sum = 0;
    this.totalarray = this.db.list('/startstop/' + this.user_id, {
      query: {
        orderByChild: 'objectID',
        equalTo: objectkey
      }
    });
    this.totalarray.subscribe((obj) => {
      for (let i = 0; i < obj.length; i++) {
        let dif = obj[i].stopTimeunix - obj[i].startTimeunix;
        sum = sum + dif;
      }
      this.total = sum
    });
    var stored = JSON.parse(localStorage.getItem(objectkey));
    console.log("stored start time" + stored.startTime)
    console.log("stored stop time" + stored.stopTime)
    console.log(this.total);
    return this.total;
  }
}
