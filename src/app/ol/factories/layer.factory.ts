import Layer from 'ol/layer/Layer';


export default abstract class LayerFactory{

    /**
     * Crea un layer de acuerdo al constructor
     */
    abstract createTileLayer(): Layer;

    abstract createImageLayer(): Layer;

    abstract createVectorLayer(): Layer;

}