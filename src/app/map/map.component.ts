import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MapService } from './map.service';
import Property from '../core/property.interface';
import Observer from '../core/Observer.interface';
import Observable from '../core/Observable.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements AfterViewInit, Observer{

  @Output() propertySelected: EventEmitter<Property>;;

  @ViewChild('map') containerMap: ElementRef;

  DEFAULT_BASE_LAYER = 1;

  constructor(private mapFacade: MapService) { 
    this.propertySelected = new EventEmitter<Property>();
  }

  ngAfterViewInit(): void {

    this.mapFacade.setMapTarjet(this.containerMap.nativeElement);

    this.mapFacade.buildMap();

    this.mapFacade.setVisibleBaseLayer(this.DEFAULT_BASE_LAYER);

    this.mapFacade.addObserver(this);
  }

  // Refactor
  public getMapService(): MapService {
    return this.mapFacade;
  }


  update(subject: Observable, args: any): void {
    this.propertySelected.emit(args);
  }
}