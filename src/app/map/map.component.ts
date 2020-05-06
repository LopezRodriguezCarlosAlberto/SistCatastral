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
import { FullScreen } from 'ol/control';
import BaseLayer from 'ol/layer/Base';

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

  @ViewChild('map') containerMap: ElementRef;

  private clearControl: Control;
  private geoserver: LayerGroup;
  private baseGroup: LayerGroup;

  layernames = [
   /*  { name: 'Base Layers', visible: true },*/
  ];

  ngAfterViewInit(): void {
    this.setTarget(this.containerMap.nativeElement);
    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');
    const zoom = 19;
    const maxZoom = 25;
    const minZoom = 5;

    this.setView(new View({ center, zoom, minZoom, maxZoom }));

    /** Controls */
    this.clearControl = new ClearControl(true, {});
    this.addControl(this.clearControl);

    this.clearControl = new FullScreen({});
    this.addControl(this.clearControl);

    let undoredo = new BackNextControl({});
    this.addControl(undoredo);

    let print = new PrintControl({});
    this.addControl(print);
  }

  constructor() {
    super({});
    this.baseGroup = new LayerGroup({
      layers: [
        // osm: 
        new FactoryOSM({}).createTileLayer(),
        // humanitarian:
        new FactoryOSM({ url: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' }).createTileLayer()
      ]
    });
    // Geoserver
    this.addLayerItem('Base Layer', this.baseGroup);
    this.addLayerItem('Zonas',      new CamargoFactory('GDB08', 'zonas').createImageLayer());
    this.addLayerItem('Localidades',new CamargoFactory('GDB08', 'localidades').createImageLayer());
    this.addLayerItem('Sectores',   new CamargoFactory('GDB08', 'sectores').createImageLayer());
    this.addLayerItem('Asentamientos',new CamargoFactory('GDB08', 'asentamientos').createImageLayer());
    this.addLayerItem('Vialidades', new CamargoFactory('GDB08', 'vialidades').createImageLayer());
    this.addLayerItem('Manzanas',   new CamargoFactory('GDB08', 'manzanas').createImageLayer());
    this.addLayerItem('Predios|Propiedades',    new CamargoFactory('GDB08011', 'p').createImageLayer());
  }

  /**
   * 
   * @param name El Nombre del Layer
   * @param layer El Objeto Layer
   */
  addLayerItem(name: string, layer: BaseLayer) {
    this.addLayer(layer);
    this.layernames.push( {name, visible: layer.getVisible()} );
  }

}