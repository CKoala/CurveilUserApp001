import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetail } from './order-detail';

@NgModule({
  declarations: [
    OrderDetail,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetail)
  ],
  exports: [
    OrderDetail
  ]
})
export class OrderDetailModule {}
