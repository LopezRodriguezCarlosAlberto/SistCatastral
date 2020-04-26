import { Component, OnInit } from '@angular/core';
import { NguiMapComponent } from '@ngui/map';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent  {
  
  constructor(public mapCor: MapService) { 
  }

  public getX(){
   return this.mapCor.getPositionX();
  }

  public getY(){
    return this.mapCor.getPositionY();
  }

 
}
