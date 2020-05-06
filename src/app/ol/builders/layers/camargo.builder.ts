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
import { transform } from 'ol/proj';

export interface CQL_PARAM {
    key: string;
    value: string;
}


export default class CamargoVectorLayerBuilder extends VectorLayerBuilder {

    urlBuilder: URLBuilder;

    URL_BASE: string = 'http://187.189.192.102:8080/geoserver/';
    SERVER_NAME_GEOM = 'geom'; // Fix. Agregar una funcion que construya esta variable
    CQL_QUERY: string;

    WORKSPACE: string;
    NAME_LAYER: string;

    constructor() {
        super();
        this.CQL_QUERY = '';
        this.urlBuilder = new URLBuilder()
            .setParam('service', 'WFS')
            .setParam('version', '1.0.0')
            .setParam('request', 'GetFeature')
            .setParam('maxFeatures', '2')
            .setParam('outputFormat', 'application/json')
            .setParam('srsname', 'epsg:3857');
    }

    workspace(name: string): VectorLayerBuilder {
        this.WORKSPACE = name;
        return this;
    }

    layer(name: string): VectorLayerBuilder {
        this.NAME_LAYER = name;
        return this;
    }

    cqlparam(key: string, value: string, condition?: string): VectorLayerBuilder {
        if (condition) {
            this.CQL_QUERY += condition + key + '=' + value;
        } else { this.CQL_QUERY += key + '=' + value; }
        return this;
    }


    url(url: string): VectorLayerBuilder {
        this.CQL_QUERY = '';
        return super.url(url);
    }

    build(): VectorLayer {
        if (this.CQL_QUERY != '') {
            this.URL_BASE += this.WORKSPACE + '/ows';
            this.urlBuilder.setBase(this.URL_BASE);
            this.urlBuilder.setParam('typename', this.WORKSPACE + ':' + this.NAME_LAYER);
            this.urlBuilder.setParam('cql_filter', this.CQL_QUERY);
            this.source.setUrl(this.urlBuilder.toString());
        }
        return this.instance;
    }

    cqlContainsPoint(point: Coordinate , condition?: string): VectorLayerBuilder {
        let coordinates = transform(point, 'EPSG:3857', 'EPSG:32613');
        if (condition) {
            // Fix. No siempre la geometria tiene el nombre de geom. En el caso de este servidor sí lo tiene por default.
            this.CQL_QUERY += condition +  'contains(geom,point(' + coordinates.join(' ') + '))';
        } else {
            this.CQL_QUERY += 'contains(geom,point(' + coordinates.join(' ') + '))';
        }
        return this;
    }


}