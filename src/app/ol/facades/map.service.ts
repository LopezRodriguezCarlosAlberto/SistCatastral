import URLBuilder from '../builders/url/url.builder';
import { Map } from 'ol';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export default class MapFacade{
    propertyVectorSource: any;
    view: any;
    MAX_ZOOM_FIT_VIEW: any;
    http: HttpClient;

    constructor(){}


    /**
     * Habilitar el evento sólo una vez.
     */
/* 
    searchAndZoomToProperty(map: Map): void {
        let myUrl = new URLBuilder('http://187.189.192.102:8080/geoserver/GDB08011/ows');
        myUrl.setParam('service', 'WFS');
        myUrl.setParam('version', '1.1.0');
        myUrl.setParam('request', 'GetFeature');
        myUrl.setParam('typename', 'GDB08011:p');
        myUrl.setParam('maxFeatures', '1');
        myUrl.setParam('CQL_FILTER', '');
        myUrl.setParam('outputFormat', 'application/json');
        myUrl.setParam('srsname', 'EPSG:3857');


        this.http.get(myUrl.toString()).subscribe(response => {
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


    }*/

}