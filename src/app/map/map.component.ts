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
import VectorLayer from 'ol/layer/Vector';
import Source from 'ol/source/Source';

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
  private baseGroup: LayerGroup;

  layerbasenames = [
  ];

  layernames = [
   /*  { name: 'Base Layers', visible: true },*/
  ];

  ngAfterViewInit(): void {
    this.setTarget(this.containerMap.nativeElement);
    const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');
    const zoom = 19;  /// Esta propiedad es NECESARIA
    const maxZoom = 25;
    const minZoom = 5;

    this.setView(new View({ center, zoom, minZoom, maxZoom }));

    /** Controls */
    this.clearControl = new ClearControl(true, {});
    this.addControl(this.clearControl);

    const fullScreen = new FullScreen({});
    this.addControl(this.clearControl);

    const undoredo = new BackNextControl({});
    this.addControl(undoredo);

    const print = new PrintControl({});
    this.addControl(print);
  }

  constructor() {
    super({});



    this.layerbasenames = [
      {name: 'OSM', layer: new FactoryOSM({}, false).createTileLayer()},
      // tslint:disable-next-line: max-line-length
      {name: 'Humanitarian', layer: new FactoryOSM({ url: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' }, false).createTileLayer() },
      {name: 'Otra', layer: new FactoryOSM({ url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'}, true).createTileLayer() }
    ];

    this.baseGroup = new LayerGroup({
      layers: this.layerbasenames.map<Layer>(obj => obj.layer)
    });
    // Geoserver
    this.addLayerItem('Base Layer', this.baseGroup);
    this.addLayerItem('Zonas',      new CamargoFactory('GDB08', 'zonas').createImageLayer(), false);
    this.addLayerItem('Localidades', new CamargoFactory('GDB08', 'localidades').createImageLayer(), false);
    this.addLayerItem('Sectores',   new CamargoFactory('GDB08', 'sectores').createImageLayer(), false);
    this.addLayerItem('Asentamientos', new CamargoFactory('GDB08', 'asentamientos').createImageLayer(), false);
    this.addLayerItem('Vialidades', new CamargoFactory('GDB08', 'vialidades').createImageLayer());
    this.addLayerItem('Manzanas',   new CamargoFactory('GDB08', 'manzanas').createImageLayer());
    this.addLayerItem('Predios|Propiedades',    new CamargoFactory('GDB08011', 'p').createImageLayer(), false);
  }

  /**
   * Añade el layer al mapa y lo registra en el array de nombre-layer
   * @param name El Nombre del Layer
   * @param layer El Objeto Layer
   * @param visible Si el layer será visible. Si no se especifica por default es true.
   * @returns void
   */
  addLayerItem(name: string, layer: BaseLayer, visible?: boolean) {
    if (visible !== undefined) { layer.setVisible(visible); }
    this.addLayer(layer);
    this.layernames.push( {name, visible: layer.getVisible()} );
  }

  // TODO: Refactor para que sea por indice.
  showBaseLayer(item: any) {
    this.layerbasenames.forEach(obj => {
      obj.layer.setVisible( item.layer === obj.layer );
    });
  }

}
