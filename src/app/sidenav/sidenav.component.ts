import { Component, OnInit, Input, ViewChild, forwardRef, Inject } from '@angular/core';
import { Map, MapBrowserEvent, Feature } from 'ol';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import Property from '../core/Property.interface';
import MarkerFactory from '../ol/factories/marker.factory';
import { Coordinate } from 'ol/coordinate';
import MeasureDrawInteraction from '../ol/interactions/measure.interaction';
import GeometryType from 'ol/geom/GeometryType';
import { MatOption } from '@angular/material/core';
import SimpleVectorLayerBuilder from '../ol/builders/layers/simplevector.builder';
import VectorLayer from 'ol/layer/Vector';
import { DrawEvent } from 'ol/interaction/Draw';
import { unByKey } from 'ol/Observable';
import { transform } from 'ol/proj';
import CamargoVectorLayerBuilder from '../ol/builders/layers/camargo.builder';
import { VectorSourceEvent } from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']

})
export class SidenavComponent implements OnInit {

  /**
   * Para mostrar la infomacion del predio seleccionao
   */
  modelProperty: any;

  opened = false;

  /**
   * Para lanzar el Google Street View en la ultima coordenada
   */
  lastMarkerCoordinate: Coordinate;

  // types: GeometryType;

  // @ViewChild('mymap') myMap: MapComponent;
  @ViewChild('line') lineOption: MatOption;
  @ViewChild('area') areaOption: MatOption;

  /**
   * El layer que contiene el Feature de la interaccion Draw Feature
   * 
   */
  layerInteraction: VectorLayer;

  /**
   * El layer que contiene el feature del predio seleccionado al hacer click, al escribir un cva
   * 
   */
  layerProperty: VectorLayer;

  constructor(private dialog: MatDialog) {
    this.modelProperty = [];
  }

  /* constructor(
    @Inject(forwardRef(() => MarkerFactory)) private markerFactory: MarkerFactory,
    private dialog: MatDialog
    ) {
    this.modelProperty = {};
  }
 */
  ngOnInit(): void {
  }

  openDialog() {
    let goo = transform(this.lastMarkerCoordinate, 'EPSG:3857', 'EPSG:4326');

    const dialogRef = this.dialog.open(DialogComponent,
      {
        data: {
          latitude: goo[1],
          longitude: goo[0]
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  };

  enableAddMarkerByClick(map: Map): void {
    map.once('click', evt => {
      this.lastMarkerCoordinate = evt.coordinate;
      map.addLayer(new MarkerFactory().createMarker(evt.coordinate));
    });
  }

  /**
   * Añade un layer con el marcador de google maps.
   * 
   * @param coordinate la coordenada del componente goo-search-box. 
   * @param map El mapa sobre el cual se va a cargar el Layer que contiene el Feature.
   */
  addGooMarker(coordinate: Coordinate, map: Map) {
    let coordinate3857 = transform(coordinate, 'EPSG:4326', 'EPSG:3857');
    this.lastMarkerCoordinate = coordinate3857;
    map.addLayer(new MarkerFactory().createMarker(coordinate3857));
    map.getView().setCenter(this.lastMarkerCoordinate);
  }

  /**
   * Añade la interaccion DRAW para dibujar Lineas o Poligonos
   * 
   * @param event El evento // Fix. Algunos componentes pueden generarlo sin evento
   * @param map El mapa sobre el cual se va a activar el evento.
   */
  optionInteractionChange(event: any, map: Map) {
    let interaction;
    if (!this.layerInteraction) {
      this.layerInteraction = new SimpleVectorLayerBuilder().stroke('#FFCC33', 4).build();
      map.addLayer(this.layerInteraction);
    }

    if (this.lineOption.selected) {
      interaction = new MeasureDrawInteraction({ type: GeometryType.LINE_STRING, source: this.layerInteraction.getSource() });
    } else if (this.areaOption.selected) {
      interaction = new MeasureDrawInteraction({ type: GeometryType.POLYGON, source: this.layerInteraction.getSource() });
    }
    interaction.once('drawend', (evt: DrawEvent) => { map.removeInteraction(interaction); });

    map.addInteraction(interaction);
    map.getViewport().addEventListener('contextmenu', evt => {
      evt.preventDefault();
      //console.log(map.getEventCoordinate(evt));
      map.removeInteraction(interaction);
    });
    this.layerInteraction = null;
  }

  /**
   * Crea un Vector layer con el feture del predio y acerca el view del mapa hacia ese feature.
   * 
   * @param clave La clave cve_cta_ori. // TODO. Mejorar el nombre del metodo
   * @param map El mapa sobre el cual se va a cargar el Feature
   */
  searchByCve(clave: string, map: Map) {
    map.removeLayer(this.layerProperty);
    this.layerProperty = new CamargoVectorLayerBuilder().workspace('GDB08011').layer('p').cqlparam('cve_cat_ori', clave).build();
    map.addLayer(this.layerProperty);
    this.layerProperty.getSource().once('addfeature', (evt: VectorSourceEvent<Geometry>) => {
      this.modelProperty = this.mapToProperty(evt.feature);
      map.getView().fit(evt.feature.getGeometry().getExtent(), { maxZoom: 19 });
    });
  }

  searchByClick(map: Map) {
    map.once('click', event => {
      map.removeLayer(this.layerProperty);
      this.layerProperty = new CamargoVectorLayerBuilder().workspace('GDB08011').layer('p').cqlContainsPoint(event.coordinate).build();
      map.addLayer(this.layerProperty);
      this.layerProperty.getSource().once('addfeature', (evt: VectorSourceEvent<Geometry>) => {
        this.modelProperty = this.mapToProperty(evt.feature);
        console.log(this.modelProperty);
        map.getView().fit(evt.feature.getGeometry().getExtent(), { maxZoom: 19 });
      });
    });
  }

  log(v) {
    console.log(v);
  }

  private mapToProperty(feature: Feature): any {
    let property = [
      {key: 'Adeudo',       value: feature.getProperties().adeudo},
      {key: 'Años de Rezago',  value: feature.getProperties().anos_rezago},
      {key: 'BC ??',           value: feature.getProperties().bc },
      {key: 'cve_cat_ant',  value:  feature.getProperties().cve_cat_ant},
      {key: 'cve_cat_est',  value: feature.getProperties().cve_cat_est},
      {key: 'cve_cat_ori',  value: feature.getProperties().f},
      {key: 'Irregular???', vaue: feature.getProperties().predio_irregular},
      {key: 'Regimen',      value: feature.getProperties().regimen},
      {key: 'Estatus',       value: feature.getProperties().status},
      {key: 'Area',  value: feature.getProperties().string_area},
      {key: 'Tipo de Predio',  value: feature.getProperties().tipo_predio},
      {key: 'Uso de Suelo',    value: feature.getProperties().uso_suelo},
      {key: 'Edicion del Usuario', value: feature.getProperties().usuario_edicion}
    ];
    return property;
  }

}
