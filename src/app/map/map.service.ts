import { Injectable, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import BaseLayer from 'ol/layer/Base';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import GeoJSON from 'ol/format/GeoJSON';

import { bbox } from 'ol/loadingstrategy';


import { HttpClient } from '@angular/common/http';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Extent } from 'ol/extent';

import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

import Draw, { DrawEvent } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { EventsKey } from 'ol/events';
import BaseEvent from 'ol/events/Event';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Coordinate } from 'ol/coordinate';

import { FullScreen } from 'ol/control';
import { DragRotateAndZoom, Select } from 'ol/interaction';

import { Size } from 'ol/size';
import * as jsPDF from 'jspdf';
import { click } from 'ol/events/condition';
import { SelectEvent } from 'ol/interaction/Select';
import { unByKey } from 'ol/Observable';

import Observable from '../core/Observable.interface';
import Property from '../core/property.interface';
import Observer from '../core/Observer.interface';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
@Injectable({
    providedIn: 'platform',
  })
export class MapService implements Observable {

    private instance: Map;
    private view: View;

    private tileBaseLayers: LayerGroup;
    private layers: LayerGroup;

    // Searching Properties
    private propertyVectorLayer: VectorLayer;
    private propertyVectorSource: VectorSource;

    // Measure interaction
    private measureSource: VectorSource;
    private measureLayer: VectorLayer;

    private sketch: Feature;

    measureTooltipElement: HTMLDivElement;
    measureTooltip: Overlay;
    continuePolygonMsg: string;
    continueLineMsg: string;
    helpTooltipElement: HTMLDivElement;
    helpTooltip: Overlay;
    coordinates: Coordinate;
    public nav_his: Movement[];
    size = 0;
    undo_redo = false;
    // Constants
    MAX_ZOOM_FIT_VIEW = 18;


    propertySelected: Property;

    // Observa el cambio en propertySelected
    observer: Observer;





    constructor(private http: HttpClient) {
        this.instance = new Map({});
        this.nav_his = new Array<Movement>();
    }
    addObserver(observer: Observer): void {
        this.observer = observer;
    }
    removeObserver(observer: Observer) {}

    notify(): void {
        this.observer.update(this, this.propertySelected);
    }

    buildMap(): void {
        // View
        const center = transform([-105.167, 27.667], 'EPSG:4326', 'EPSG:3857');

        this.view = new View({ center, zoom: 17, maxZoom: 20, minZoom: 8 });
        this.instance.setView(this.view);


        // Layers Base y Overlay
        this.initTileLayers();
        this.instance.addLayer(this.layers);


        // Buscar Predio
        this.initVectorLayers();
        this.instance.addLayer(this.propertyVectorLayer);

        // Measure 
        this.initInteraction();
        this.instance.addLayer(this.measureLayer);

        this.instance.addControl(new FullScreen);
        this.instance.addInteraction(new DragRotateAndZoom);
        this.InitHistory();

        //this.initControlSelectProperty();
        this.Point();
        
    }


    private initTileLayers(): void {
        // Tile Layers
        let osm_source = new OSM();
        let osm: Layer = new TileLayer({ source: osm_source });

        let osm_humanitarian_source = new OSM({ url: 'http://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', crossOrigin: "anonymous" });
        let osm_humanitarian: Layer = new TileLayer({ source: osm_humanitarian_source, });

        let stamen_source = new XYZ({ url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', crossOrigin: "anonymous" });
        let stamen: Layer = new TileLayer({ source: stamen_source });

        this.tileBaseLayers = new LayerGroup({ layers: [osm, osm_humanitarian, stamen] });

        osm.setVisible(true);
        osm_humanitarian.setVisible(false);
        stamen.setVisible(false);

        // Tile Layers from SUAC GDB08:vialidades

        let zones_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:zonas', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        let localities_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:localidades', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        let sectors_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:sectores', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        // Asentamientos
        let township_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:asentamientos', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });


        let roads_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:vialidades', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });

        let blocks_source = new ImageWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08:manzanas', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });


        let properties_source = new TileWMS({
            url: 'http://187.189.192.102:8080/geoserver/GDB08011/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: 'GDB08011:p', VERSION: '1.1.1', FORMAT: 'image/png', TILED: 'true',
            },
            serverType: 'geoserver',
        });


        let zones_layer = new ImageLayer({ source: zones_source });
        let localities_layer = new ImageLayer({ source: localities_source });
        let sectors_layer = new ImageLayer({ source: sectors_source });
        let township_layer = new ImageLayer({ source: township_source });
        let roads_layer = new ImageLayer({ source: roads_source });
        let blocks_layer = new ImageLayer({ source: blocks_source });
        let properties_layer = new TileLayer({ source: properties_source });

        properties_layer.setVisible(false);
        blocks_layer.setVisible(false);

        /** Misiing Construcciones */
        this.layers = new LayerGroup({
            layers: [this.tileBaseLayers, zones_layer, localities_layer, sectors_layer, township_layer,
                roads_layer, blocks_layer, properties_layer]
        });



    }

    private initVectorLayers(): void {
        // Styling
        let fill: Fill = new Fill({ color: 'rgb(66, 255, 161)' });
        let stroke: Stroke = new Stroke({ color: '#ffcc33', width: 2 });

        // Vector
        this.propertyVectorSource = new VectorSource({ useSpatialIndex: false, format: new GeoJSON() });

        this.propertyVectorLayer = new VectorLayer({
            source: this.propertyVectorSource,
            style: new Style({ fill, stroke, })
        });

    }


    searchAndZoomToProperty(cta_orig_property: string): void {
        let url = 'http://187.189.192.102:8080/geoserver/GDB08011/ows?' +
            'service=WFS&' +
            'version=1.1.0&' +
            'request=GetFeature&' +
            'typename=GDB08011:p&' +
            'maxFeatures=1&' +
            "&CQL_FILTER=cve_cat_ori='" + cta_orig_property + "'&" + // ej. cta_orig_property: 1005006006
            'outputFormat=application/json&' +
            'srsname=EPSG:3857';

        this.propertyVectorSource.clear(true);


        this.http.get(url).subscribe(response => {
            // Handle Response
            new GeoJSON().readFeatures(response).forEach(
                (feature: Feature<Geometry>, index: number, features: Feature<Geometry>[]) => {
                    this.propertyVectorSource.addFeature(feature);

                });

            // Zoom to property
            if (this.propertyVectorSource.getFeatures().length > 0) {
                console.log('Zoom');
                const extent: Extent = this.propertyVectorSource.
                    getFeaturesCollection().getArray()[0].getGeometry().getExtent();

                this.view.fit(extent, { maxZoom: this.MAX_ZOOM_FIT_VIEW });



            } else {
                alert('No se encontré algún Predio con ese Numero');
            }
        });


    }


    setMapTarjet(tarjet: HTMLElement) {
        if (tarjet instanceof HTMLDivElement) {
            this.instance.setTarget(tarjet);
        }
    }

    setVisibleBaseLayer(position: number): void {
        this.tileBaseLayers.getLayers().forEach(
            // tslint:disable-next-line: no-shadowed-variable
            (layer: BaseLayer, pos: number, p2: BaseLayer[]) => {
                layer.setVisible(position === pos);
            }
        );
    }

    toggleVisibleSUACLayer(position: number): void {
        let isVisible = this.layers.getLayers().getArray()[position].getVisible();

        this.layers.getLayers().getArray()[position].setVisible(!isVisible);
    }

    // Interactions



    private initInteraction(): void {

        this.continuePolygonMsg = 'Click to continue drawing the polygon';
        this.continueLineMsg = 'Click to continue drawing the line';

        this.measureSource = new VectorSource();

        this.measureLayer = new VectorLayer({
            source: this.measureSource,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
            })
        });



    }

    addInteraction(_type: string): void {
        const type: GeometryType = (_type === 'area' ? GeometryType.POLYGON : GeometryType.LINE_STRING);

        this.createHelpTooltip();
        this.createMeasureTooltip();

        this.addEventOnToMap();

        let draw = new Draw({
            source: this.measureSource,
            type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
            })
        });

        this.instance.addInteraction(draw);


        let listener: EventsKey;
        draw.on('drawstart',
            (evt: DrawEvent) => {
                // set sketch

                this.sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                let tooltipCoord: Coordinate;// = evt.target.getCoordinates();

                // console.log (evt.target.);

                listener = this.sketch.getGeometry().on('change', (event: BaseEvent) => {
                    let geom = event.target;
                    let output;
                    if (geom instanceof Polygon) {
                        output = this.formatArea(geom);

                        // console.log(output);

                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = this.formatLength(geom);

                        // console.log(output);

                        tooltipCoord = geom.getLastCoordinate();
                    }
                    this.measureTooltipElement.innerHTML = output;
                    this.measureTooltip.setPosition(tooltipCoord);
                });
            });

        draw.on('drawend',
            () => {
                this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                this.measureTooltip.setOffset([0, -7]);
                // unset sketch
                this.sketch = null;
                // unset tooltip so that a new one can be created
                this.measureTooltipElement = null;
                this.createMeasureTooltip();
                unByKey(listener);

                // Clear Map listener
                if (this.instance.getListeners('pointermove').length > 0) {
                    this.instance.removeEventListener('pointermove',
                        this.instance.getListeners('pointermove')[0]);
                }

                // Remove Draw Instance
                this.instance.removeInteraction(draw);
            });

    }

    addEventOnToMap(): void {

        this.instance.on('pointermove',
            (evt: MapBrowserEvent) => {

                if (evt.dragging) {
                    return;
                }
                let helpMsg = 'Click to start drawing';

                if (this.sketch) {
                    const geom: Geometry = this.sketch.getGeometry();
                    if (geom instanceof Polygon) {
                        helpMsg = this.continuePolygonMsg;
                    } else if (geom instanceof LineString) {
                        helpMsg = this.continueLineMsg;
                    }
                }


                // console.log(helpMsg);
                this.helpTooltipElement.innerHTML = helpMsg;
                this.helpTooltip.setPosition(evt.coordinate);
                this.helpTooltipElement.classList.remove('hidden');

            }
        );

    }


    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength(line: LineString): string {
        let length: number = line.getLength();
        let output: string;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    }


    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea(polygon: Polygon): string {
        let area: number = polygon.getArea();
        let output: string;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    }

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip(): void {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }

        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: OverlayPositioning.CENTER_LEFT
        });
        this.instance.addOverlay(this.helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(): void {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: OverlayPositioning.BOTTOM_CENTER
        });
        this.instance.addOverlay(this.measureTooltip);
    }
    // ---------------------------------[INICIO]Historial de navegacion------------------------------

    InitHistory() {
        let move: Movement;
        this.instance.on('moveend', () => {
            if (this.undo_redo === false) {
                move = {
                    extent: this.instance.getView().calculateExtent(this.instance.getSize()),
                    size: this.instance.getSize(),
                    zoom: this.instance.getView().getZoom()
                };
                this.nav_his.push(move);
                this.size = this.size + 1;
            }
        });

    }
    // ---------------------------------[FIN]Historial de navegacion------------------------------

    BackControl() {

        if (this.size > 0) {
            this.undo_redo = true;
            console.log("Back" + this.size);
            this.instance.getView().fit(this.nav_his[this.size - 1].extent, { size: this.nav_his[this.size - 1].size });
            this.instance.getView().setZoom(this.nav_his[this.size - 1].zoom);
            setTimeout(() => {
                this.undo_redo = false;
            }, 360);
            this.size = this.size - 1;
        }


    }

    NextMoveControl() {

        if (this.size < (this.nav_his.length - 1)) {
            this.undo_redo = true;
            this.instance.getView().fit(this.nav_his[this.size + 1].extent, { size: this.nav_his[this.size + 1].size });
            this.instance.getView().setZoom(this.nav_his[this.size + 1].zoom);
            setTimeout(function () {
                this.undo_redo = false;
            }, 360);
            this.size = this.size + 1;
        }

    }

    PrinterDocument() {

        let mapCanvas = document.createElement('canvas');
        mapCanvas.width = 1000;
        mapCanvas.height = 500;
        let mapContext = mapCanvas.getContext('2d');


        Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), (canvas) => {
            if (canvas.width > 0) {
                var opacity = canvas.parentNode.style.opacity;
                mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                var transform = canvas.style.transform;
                var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
                CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
                mapContext.drawImage(canvas, 0, 0);
            }
        });


        var doc = new jsPDF('landscape', 'pt', 'letter');
        doc.addImage(mapCanvas.toDataURL('image/jpeg'), 'jpeg', 30, 50, 700, 500);
        doc.save('mapa.pdf');


    }

    // Select Control
    // Permite seleccionar los predios y mostrar informacion reelevante de ellos.
    initControlSelectProperty(): void {
        let selectClick = new Select({
            condition: click
        });

        this.instance.addInteraction(selectClick);

        selectClick.on('select', (e: SelectEvent) => {
            // e.selected[0].getProperties() as //getArray().forEach( index =>{
            //    console.log( console.log(index, ':', e.selected[0].getProperties()[index].value) );
            // });

            this.propertySelected = {
                adeudo: e.selected[0].getProperties()['adeudo'],
                anos_rezago: e.selected[0].getProperties()['anos_rezago'],
                bc:  e.selected[0].getProperties()['bc'],
                cve_cat_ant: e.selected[0].getProperties()['cve_cat_ant'],
                cve_cat_est: e.selected[0].getProperties()['cve_cat_est'],
                cve_cat_ori: e.selected[0].getProperties()['cve_cat_ori'],
                predio_irregular: e.selected[0].getProperties()['predio_irregular'],
                regimen: e.selected[0].getProperties()['regimen'],
                status: e.selected[0].getProperties()['status'],
                string_area: e.selected[0].getProperties()['string_area'],
                tipo_predio: e.selected[0].getProperties()['tipo_predio'],
                uso_suelo: e.selected[0].getProperties()['uso_suelo'],
                usuario_edicion: e.selected[0].getProperties()['usuario_edicion'],
            };

            this.notify();

        });

        let propertiesSourceSelect = new VectorSource({
            url: '../../assets/properties_camargo.json',
            format: new GeoJSON(),
            useSpatialIndex: false,
            strategy: bbox
        });

        let propertiesLayerSelect = new VectorLayer({ source: propertiesSourceSelect });
        // let propertiesLayerSelect = new VectorLayer({ source: clusterSource });

        this.instance.addLayer(propertiesLayerSelect);
    }

    Point(){
        this.instance.on('click', (evt: MapBrowserEvent) => {
           this.coordinates = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            });
    }

    getPositionX(){
        return this.coordinates[0];
        
    }

    getPositionY(){
        return this.coordinates[1];
    }

   

}

interface Movement {
    extent: Extent;
    size: Size
    zoom: number;
}