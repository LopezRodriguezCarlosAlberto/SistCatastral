import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import { Coordinate } from 'ol/coordinate';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';


export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAyVBMVEUAAADnTDznTDvnTDvnTDvAOCrnTDznSzvnTDvAOCvnTDznTDznTDvnTDzAOCrnTDvnTDvnTDvnTDznTDvAOSrnTDznTDzTQjLSQjPnTDzpTDvnSzvAOCrnTDvAOSvAOCvnSzvnTDzAOCvnSzznTDznTDvnTDy/OCvnTDznTDvnTDznSzvmSzvAOCvnTDzAOCvnTDvmTDvAOCq+OCrpTDzkSzrbRjbWRDTMPi+8NinrTT3EOy3gSDjTQjPPQDLHPS/DOiu5NCjHPC5jSfbDAAAAMHRSTlMAKPgE4hr8CfPy4NzUt7SxlnpaVlRPIhYPLgLt6ebOysXAwLmej4iGgGtpYkpAPCBw95QiAAAB50lEQVQ4y42T13aDMAxAbVb2TrO6927lwQhktf//UZWVQ1sIJLnwwBEXWZYwy1Lh/buG5TXu+rzC9nByDQCCbrg+KdUmLUsgW08IqzUp9rgDf5Ds8CJv1KS3mNL3fbGlOdr1Kh1AtFgs15vke7kQGpDO7pYGtJgfbRSxiXxaf7AjgsFfy1/WPu0r73WpwGiu1Fn78bF9JpWKUBTQzYlNQIK5lDcuQ9wbKeeBiTWz3vgUv44TpS4njJhcKpXEuMzpOCN+VE2FmPA9jbxjSrOf6kdG7FvYmkBJ6aYRV0oVYIusfkZ8xeHpUMna+LeYmlShxkG+Zv8GyohLf6aRzzRj9t+YVgWaX1IO08hQyi9tapxmB3huxJUp8q/EVYzB89wQr0y/FwqrHLqoDWsoLsxQr1iWNxp1iCnlRbt9IdELwfDGcrSMKJbGxLx4LenTFsszFSYehwl6aCZhTNPnO6LdBYOGYBVFqwAfDF27+CQIvLUGrTU9lpyFBw9yeA+sCNsRkJ5WQjg2K+QFcrywEjoCBHVpe3VYGZyk9NQCLxXte/jHvc1K4XXKSNQ520PPtIhcr8f2MXPShNiavTyn4jM7wK0g75YdYgTE6KA465nN9GbsILwhoMHZETx53hM7Brtet9lRDAYFwR80rG+sfAnbpQAAAABJRU5ErkJggg==';



export default abstract class VectorLayerBuilder {
    source: VectorSource;
    instance: VectorLayer;
    style: Style;

    constructor() {
        this.instance = new VectorLayer({});
        // Default Style
        this.style = new Style({
            image: new Icon({
                anchor: DEFAULT_ANCHOR,
                src: DEFAULT_ICON
            }),
            fill: new Fill({ color: 'rgb(66, 255, 161)' }),
            stroke: new Stroke({ color: '#ffcc33', width: 2 })
        });
        /// useSpatialIndex: false  -- Permite que se obtenga una lista de Features a traves de 
        // getFeaturesCollection
        this.source = new VectorSource({ useSpatialIndex: false, format: new GeoJSON() });

        // Preparando el Souce y el Layer
        this.instance.setSource(this.source);
        this.instance.setStyle(this.style);
    }


    fill(color: string): VectorLayerBuilder {
        this.style.getFill().setColor(color);
        return this;
    }

    stroke(color: string, width?: number): VectorLayerBuilder {
        this.style.getStroke().setColor(color);
        if (width) { this.style.getStroke().setWidth(width); }
        return this;
    }

    image(url: string): VectorLayerBuilder {
        // FIXME:  De momento no encontre como cambiar la imagen.
        // this.style.getImage().
        return this;
    }

    url(url: string): VectorLayerBuilder {
        this.source.setUrl(url);
        return this;
    }


    addPoint(p: Coordinate): VectorLayerBuilder {
        let point = new Feature({ geometry: new Point(p) });
        this.source.addFeature( point );
        return this;
    }

    // Provee un mecanismo para que layers ya existentes se reconstruyan.
    // Debe aparecer al inicio de la construccion. Si no los cambios 
    setLayer(newLayer: VectorLayer){
        this.instance = newLayer;
        // Redireccionando el source y el Layer
        this.instance.setSource(this.source);
        this.instance.setStyle(this.style);
    }

    /**
     *
     * @param key pueder ser una propiedad del feature a solicitar. ej. cve_cat_orig
     * @param value valor del parametro. Tambien puede ser una funcion para el geometry del feature. ej. contains(geom, point(1 2 3 4))
     * @param condition de la especificacion del GeoServer https://docs.geoserver.org/latest/en/user/filter/ecql_reference.html#filter-ecql-reference
     */
    abstract cqlparam(key: string, value: string, condition?: string): VectorLayerBuilder;
    
    // TODO: Agregar fuente de la documentacion de los filtros por geometria.
    abstract cqlContainsPoint(point: Coordinate ,condition?: string): VectorLayerBuilder;
    abstract workspace(name: string): VectorLayerBuilder;
    abstract layer(name: string): VectorLayerBuilder;
    abstract build(): VectorLayer;

}