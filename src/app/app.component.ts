import { Component } from '@angular/core';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get } from 'ol/proj';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sidebar';

  constructor(){
    proj4.defs('EPSG:32613', '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs');
    register(proj4);
    get('EPSG:32613');

  }

}
