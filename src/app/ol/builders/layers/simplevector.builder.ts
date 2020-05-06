import VectorLayer from 'ol/layer/Vector';
import VectorLayerBuilder from './vectorlayer.builder';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import URLBuilder from '../url/url.builder';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import Projection from 'ol/proj/Projection';

export interface CQL_PARAM {
    key: string;
    value: string;
}


/**
 * Esta clase es solo un adaptador de la abstracta VectorLayerBuilder.
 */
export default class SimpleVectorLayerBuilder extends VectorLayerBuilder {

    constructor() {
        super();
    }

    workspace(name: string): VectorLayerBuilder { return this; }

    layer(name: string): VectorLayerBuilder { return this; }

    cqlparam(key: string, value: string, condition?: string): VectorLayerBuilder { return this; }

    cqlContainsPoint(point: Coordinate, condition?: string):VectorLayerBuilder{return this;}

    build(): VectorLayer { return this.instance; }

}