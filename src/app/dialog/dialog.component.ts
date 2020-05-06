import { Component, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent  {
  longitude: number;
  latitude: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }
 
}
