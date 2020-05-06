import { Component, OnInit, ViewChild, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Coordinate } from 'ol/coordinate';
 
@Component({
  selector: 'goo-box-search',
  templateUrl: './google-maps.component.html',
  styleUrls: []
})
export class GoogleMapsComponent implements OnInit {

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  // coordinate: Coordinate;

  @Output() coordinateChange: EventEmitter<Coordinate>;

  @ViewChild('search')
  public searchElementRef: ElementRef;
 
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { this.coordinateChange = new EventEmitter<Coordinate>();}

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      //this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and fire Event
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.coordinateChange.emit([this.longitude, this.latitude]);

        });
      });
    });
  }
 
}

