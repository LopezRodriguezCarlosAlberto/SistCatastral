import Layer from 'ol/layer/Layer';
import LayerFactory from './layer.factory';
import OSM, { Options } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';


export default class CamargoFactory extends LayerFactory {

    URL_BASE = "http://187.189.192.102:8080/geoserver/";

    private visible = true;
    private opt_options = {};
    private crossOrigin = "anonymous";

    constructor(private workspace: string, private layer: string, visible?: boolean) {
        super();
        this.visible = visible;
    }

    createTileLayer(): Layer {
        const source = new TileWMS({
            url: this.URL_BASE + this.workspace + '/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: this.workspace + ':' + this.layer,
                VERSION: '1.1.1',
                FORMAT: 'image/png',
                TILED: 'true',
            },
            serverType: 'geoserver',
        });

        const layer = new TileLayer({ source });

        return layer;

    }
    createImageLayer(): Layer {
        const source = new ImageWMS({
            url: this.URL_BASE + this.workspace + '/wms', crossOrigin: "anonymous",
            params: {
                LAYERS: this.workspace + ':' + this.layer,
                VERSION: '1.1.1',
                FORMAT: 'image/png',
                TILED: 'true',
            },
            serverType: 'geoserver',
        });

        const layer = new ImageLayer({ source });

        return layer;
    }

    createVectorLayer(): Layer {
        return null;
    }
}