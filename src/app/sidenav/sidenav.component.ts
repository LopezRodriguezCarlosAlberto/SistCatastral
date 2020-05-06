import { Component, OnInit, Input, ViewChild, forwardRef, Inject } from '@angular/core';
import { Map, MapBrowserEvent } from 'ol';
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

  modelProperty: Property;

  opened = false;

  multiple = false;
  lastMarkerCoordinate: Coordinate;

  // types: GeometryType;

  // @ViewChild('mymap') myMap: MapComponent;
  @ViewChild('line') lineOption: MatOption;
  @ViewChild('area') areaOption: MatOption;
  containerInteraction: VectorLayer;

  constructor(private dialog: MatDialog){
    this.modelProperty = {}
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

  loadProperty(property: Property) {
    this.modelProperty = property;
  }

  openDialog() {
    let goo = transform(this.lastMarkerCoordinate, 'EPSG:3857', 'EPSG:4326');

    const dialogRef = this.dialog.open(DialogComponent,
      {data: {latitude: goo[1],
              longitude: goo[0]}});

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

  addGooMarker(coordinate: Coordinate, map: Map){
    let coordinate3857 = transform(coordinate, 'EPSG:4326', 'EPSG:3857');
    this.lastMarkerCoordinate = coordinate3857;
    map.addLayer(new MarkerFactory().createMarker(coordinate3857));
    map.getView().setCenter(this.lastMarkerCoordinate);
  }

  optionInteractionChange(event: any, map: Map) {
    let interaction;
    if (!this.containerInteraction ) {
        this.containerInteraction = new SimpleVectorLayerBuilder().stroke('#FFCC33', 4).build();
        map.addLayer(this.containerInteraction);
    }

    if (this.lineOption.selected) {
      interaction = new MeasureDrawInteraction({ type: GeometryType.LINE_STRING, source: this.containerInteraction.getSource() });
    } else if (this.areaOption.selected) {
      interaction = new MeasureDrawInteraction({ type: GeometryType.POLYGON, source: this.containerInteraction.getSource() });
    }
    interaction.once('drawend', (evt: DrawEvent) => { map.removeInteraction(interaction); });

    map.addInteraction(interaction);
    map.getViewport().addEventListener('contextmenu', evt => {
      evt.preventDefault();
      //console.log(map.getEventCoordinate(evt));
      map.removeInteraction(interaction);
    });
    this.containerInteraction = null;
  }

  buscarByCve(clave: string, map: Map){
    let propertyContainer = new CamargoVectorLayerBuilder().workspace('GDB08011').layer('p').cqlparam('cve_cat_ori', clave).build();
    map.addLayer( propertyContainer );
    propertyContainer.getSource().once('addfeature', (evt: VectorSourceEvent<Geometry>) => {
      map.getView().fit(evt.feature.getGeometry().getExtent(), {maxZoom: 19} );
    });
  }

  buscarByClick(map: Map){
    map.once('click', event =>{
      let propertyContainer = new CamargoVectorLayerBuilder().workspace('GDB08011').layer('p').cqlContainsPoint(event.coordinate).build();
      map.addLayer( propertyContainer );
      propertyContainer.getSource().once('addfeature', (evt: VectorSourceEvent<Geometry>) => {
        map.getView().fit(evt.feature.getGeometry().getExtent(), {maxZoom: 19} );
      });
    });
  }

  log(v) {
    console.log(v);
  }
}
