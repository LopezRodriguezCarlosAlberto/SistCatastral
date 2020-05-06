import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import FactoryOSM from '../ol/factories/osmlayerfactory';
import CamargoFactory from '../ol/factories/camargolayer.factory';
import LayerGroup from 'ol/layer/Group';
import { View } from 'ol';
import { transform } from 'ol/proj';
import ClearControl from '../ol/controls/clearcontrol';
import Control from 'ol/control/Control';
import BackNextControl from '../ol/controls/backnextcontrol';
import Layer from 'ol/layer/Layer';
import PrintControl from '../ol/controls/printcontrol';

export interface LayerData {
  layer: Layer;
  name: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent extends Map implements AfterViewInit {

  private clearControl: Control;

  @ViewChild('map') containerMap: ElementRef;

  geoserver: LayerGroup;
  baseGroup: LayerGroup;

  constructor() {
    super({});
  }

  ngAfterViewInit(): void {
    this.setTarget(this.containerMap.nativeElement);
    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');
    const zoom = 19;
    const maxZoom = 25;
    const minZoom = 5;

    this.setView(new View({ center, zoom, minZoom, maxZoom }));
    this.initLayers();

    /** Controls */
    this.clearControl = new ClearControl(true, {});
    this.addControl(this.clearControl);

    let undoredo = new BackNextControl({});
    this.addControl(undoredo);

    let print = new PrintControl({});
    this.addControl(print);

    /** Interactions */
    // let v = new CamargoVectorLayerBuilder().stroke('#ffcc33', 3).build();
    // let interaction = new MeasureDrawInteraction({ source: v.getSource(), type: GeometryType.LINE_STRING });    
    // this.addInteraction(interaction);
    // this.addLayer(v);

  }

  initLayers() {
    this.baseGroup = new LayerGroup({
      layers: [
        // osm: 
        new FactoryOSM({}).createTileLayer(),
        // humanitarian:
        new FactoryOSM({ url: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' }).createTileLayer()
      ]
    });

    this.geoserver = new LayerGroup({
      layers: [
        // Geoserver
        new CamargoFactory('GDB08', 'zonas').createImageLayer(),
        new CamargoFactory('GDB08', 'localidades').createImageLayer(),
        new CamargoFactory('GDB08', 'sectores').createImageLayer(),
        new CamargoFactory('GDB08011', 'p').createImageLayer(),

      ]
    });

    this.addLayer(this.baseGroup);
    this.addLayer(this.geoserver);


    /*  this.addLayer(
       new CamargoVectorLayerBuilder().workspace('GDB08011').layer('p')
               .cqlparam('cve_cat_ori', '1005006006').build()
     ); */
  }

  // fitViewOnExtent( feature: Feature ): void {}

}