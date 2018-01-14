webpackJsonp([0],{

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__order_detail__ = __webpack_require__(427);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderDetailModule", function() { return OrderDetailModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var OrderDetailModule = (function () {
    function OrderDetailModule() {
    }
    return OrderDetailModule;
}());
OrderDetailModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__order_detail__["a" /* OrderDetail */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__order_detail__["a" /* OrderDetail */])
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__order_detail__["a" /* OrderDetail */]
        ]
    })
], OrderDetailModule);

//# sourceMappingURL=order-detail.module.js.map

/***/ }),

/***/ 427:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderDetail; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrderDetail = (function () {
    function OrderDetail(alertCtrl, navCtrl, navParams, db, afAuth) {
        var _this = this;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.afAuth = afAuth;
        afAuth.authState.subscribe(function (user) {
            if (!user) {
                _this.displayName = null;
                _this.email = null;
                _this.user_id = null;
                return;
            }
            _this.displayName = user.displayName;
            _this.email = user.email;
            _this.user_id = user.uid;
            _this.order = navParams.get('order');
            _this.orders = db.list('/orders/' + _this.user_id);
            _this.startstoparray = _this.db.list('/startstop/' + _this.user_id, {
                query: {
                    orderByChild: 'objectID',
                    equalTo: _this.order.$key
                }
            });
            _this.startstoparray.subscribe(function (obj) {
                _this.startarray = obj;
            });
            _this.status = db.object('/status/' + _this.user_id);
            _this.status.subscribe(function (obj) {
                _this.timeStatus = obj;
                if (_this.timeStatus.status === 'minutes') {
                    _this.secUnits = false;
                    _this.minUnits = true;
                    _this.hourUnits = false;
                }
                else if (_this.timeStatus.status === 'seconds') {
                    _this.secUnits = true;
                    _this.minUnits = false;
                    _this.hourUnits = false;
                }
                else if (_this.timeStatus.status === 'hours') {
                    _this.secUnits = false;
                    _this.minUnits = false;
                    _this.hourUnits = true;
                }
            });
            _this.addDifferences();
        });
    }
    OrderDetail.prototype.secondsTimeUnit = function () {
        this.status.update({
            status: 'seconds'
        });
    };
    OrderDetail.prototype.minutesTimeUnit = function () {
        this.status.update({
            status: 'minutes'
        });
    };
    OrderDetail.prototype.hoursTimeUnit = function () {
        this.status.update({
            status: 'hours'
        });
    };
    OrderDetail.prototype.addDifferences = function () {
        var _this = this;
        var sum = 0;
        this.startstoparray.subscribe(function (obj) {
            for (var i = 0; i < obj.length; i++) {
                var dif = obj[i].stopTimeunix - obj[i].startTimeunix;
                sum = sum + dif;
            }
            _this.total = sum;
        });
    };
    OrderDetail.prototype.removeStartStop = function (key, start, stop) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Delete this job time keeper?',
            message: 'Permanently remove order from ' + start + ' to ' + stop,
            buttons: [
                {
                    text: 'cancel',
                    handler: function () {
                        console.log('cancel');
                    }
                },
                {
                    text: 'Yes! Delete this order',
                    handler: function () {
                        _this.delete(key);
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    OrderDetail.prototype.delete = function (key) {
        this.startstoparray.remove(key);
    };
    return OrderDetail;
}());
OrderDetail = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* Component */])({
        selector: 'page-order-detail',template:/*ion-inline-start:"C:\Users\carla\Documents\GitHub\CurveilUserApp001\src\pages\order-detail\order-detail.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{ order.TaskIdentifier }}</ion-title>\n\n        <p *ngIf="user_id">Logged in as: {{displayName}}</p>\n\n        <p *ngIf="!user_id">Not Logged in</p>\n\n        <ion-grid id="segmentControl" mode="md">\n\n            <ion-row>\n\n                <ion-col (click)="secondsTimeUnit()">\n\n                    sec\n\n                </ion-col>\n\n                <ion-col (click)="minutesTimeUnit()">\n\n                    min\n\n                </ion-col>\n\n                <ion-col (click)="hoursTimeUnit()">\n\n                    hrs\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-grid>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-grid>\n\n        <ion-row class="colheaders">\n\n            <ion-col col-1>\n\n            </ion-col>\n\n            <ion-col col-4>\n\n                <p>start time</p>\n\n            </ion-col>\n\n            <ion-col col-4>\n\n                <p>stop time</p>\n\n            </ion-col>\n\n            <ion-col col-3>\n\n                <p>difference</p>\n\n            </ion-col>\n\n        </ion-row>\n\n        <ion-row *ngFor="let time of startarray" class="timeDetail">\n\n            <ion-col col-1 class="centered">\n\n                <ion-icon name="ios-trash" id="trash-icon" (click)="removeStartStop(time.$key, time.startTime, time.stopTime)"></ion-icon>\n\n            </ion-col>\n\n            <ion-col col-4>\n\n                 <p id="grey">{{time.startTime}}</p>\n\n            </ion-col>\n\n            <ion-col col-4>\n\n                <p id="grey">{{time.stopTime}}</p>\n\n            </ion-col>\n\n            <ion-col col-3>\n\n                <p *ngIf="secUnits">{{((time.stopTimeunix - time.startTimeunix)/1000).toFixed(2)}}</p>\n\n                <p *ngIf="minUnits">{{((time.stopTimeunix - time.startTimeunix)/60000).toFixed(2)}}</p>\n\n                <p *ngIf="hourUnits">{{((time.stopTimeunix - time.startTimeunix)/3600000).toFixed(2)}}</p>\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n\n</ion-content>\n\n<ion-footer>\n\n    <ion-grid>\n\n        <ion-row class="totalDetail">\n\n            <ion-col col-8>\n\n                <p>total time in {{timeStatus.status}}</p>\n\n            </ion-col>\n\n            <ion-col col-4>\n\n                <p *ngIf="secUnits">{{(total/1000).toFixed(2)}}</p>\n\n                <p *ngIf="minUnits">{{(total/60000).toFixed(2)}}</p>\n\n                <p *ngIf="hourUnits">{{(total/3600000).toFixed(2)}}\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-grid>\n\n</ion-footer>'/*ion-inline-end:"C:\Users\carla\Documents\GitHub\CurveilUserApp001\src\pages\order-detail\order-detail.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["b" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["b" /* AngularFireAuth */]])
], OrderDetail);

//# sourceMappingURL=order-detail.js.map

/***/ })

});
//# sourceMappingURL=0.main.js.map