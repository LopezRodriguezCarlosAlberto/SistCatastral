import Layer from 'ol/layer/Layer';
import LayerFactory from './layer.factory';
import OSM, { Options } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';


export default class FactoryOSM extends LayerFactory {

    constructor(private options: Options, private visible?: boolean) {
        super();
        if (!options.crossOrigin) {
            this.options.crossOrigin = "anonymous";
        }
    }

    createTileLayer(): Layer {
        // Tile Layers
        let osm_source = new OSM(this.options);
        let osm: Layer = new TileLayer({ source: osm_source, visible: this.visible });

        return osm;
    }
    createImageLayer(): Layer {
        return null;
    }
    createVectorLayer(): Layer {
        return null;
    }
}