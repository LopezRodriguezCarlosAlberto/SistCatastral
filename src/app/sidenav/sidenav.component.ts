import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import Property from '../core/property.interface';
import { Coordinate } from 'ol/coordinate';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  modelProperty: Property;

  opened = false;
  
  multiple = false; 
 
  log(state) {
    console.log(state)
  }

  

  @ViewChild('mymap') myMap: MapComponent;

  constructor( public dialog: MatDialog) { this.modelProperty = {}; }

  ngOnInit(): void {
  }

  loadProperty(property: Property){
    this.modelProperty = property;
  }
  
  handleVisibleBaseLayer(index: number): void{
    this.myMap.getMapService().setVisibleBaseLayer(index);
  }

  handleCheckedOverlayLayers($event) {
    // if ($event.target.checked === true){
      let _value: string = $event.target.id;
      let overlayLayersNames = ['basemap', 'zonacatastral', 'localidad', 'sectores',  'asentamientos', 'Vialidad', 'Manzanas', 'Predios'];

      let index: number = overlayLayersNames.indexOf(_value);
      this.myMap.getMapService().toggleVisibleSUACLayer(index);
    // }
  }


  /**
   * 
   * @param cta_orig Corresponde al identificador del predio
   */
  handleClickEvent(cta_orig: string){
    this.myMap.getMapService().searchAndZoomToProperty(cta_orig);
  }

  handleClickMeasureButton(type: string): void {
    this.myMap.getMapService().onceDrawInteraction(type);
    console.log('In progress:', type);
  }

  BackClickButton(){
    this.myMap.getMapService().BackControl();
    console.log('Regresar');
  }

  NextClickButton(){
    this.myMap.getMapService().NextMoveControl();
    console.log('Siguiente');
  }

  Printer(){
    this.myMap.getMapService().PrinterDocument();
  }


  openDialog() {
    console.log(this.myMap.getMapService().getPositionY());
    const dialogRef = this.dialog.open(DialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });};

    
    enableFocusOnProperty(): void {
      this.myMap.getMapService().oncePropertyInteraction();
    }

    enableAddMarkerByClick(): void{
      this.myMap.getMapService().oncePoint();

    }

    addMarker(coordinates: Coordinate) {
      this.myMap.getMapService().addMarket(coordinates, 'EPSG:4326');
      this.myMap.getMapService().centerAndZoomView(coordinates, 'EPSG:4326');
    }
  
}
