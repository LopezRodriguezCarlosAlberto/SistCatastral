import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import SimpleVectorLayerBuilder from '../builders/layers/simplevector.builder';
import { transform } from 'ol/proj';
import { Injectable } from '@angular/core';

@Injectable()
export default class MarkerFactory {
    constructor() {}


    /**
     * 
     * @param point Longitud y Latitud donde se ubicará el punto.
     * @param projection Projection de la coordenada. Default: EPSG:3857
     */
    createMarker(point: Coordinate, projFrom?: string, projTo?: string): VectorLayer{
        let p = point;
        if(projFrom){
            p = transform(point, projFrom, projTo);
        }
        return new SimpleVectorLayerBuilder().addPoint(p).build();
    }
}