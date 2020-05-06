import Control, { Options as ControlOptions } from 'ol/control/Control';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import Layer from 'ol/layer/Layer';
import { Overlay } from 'ol';

export default class ClearControl extends Control {

    private hardDelete;

    private cleaneables: Collection<VectorLayer>;
    // 
    constructor(hardDelete?: boolean, options?: ControlOptions) {
        super({target: options.target, element: document.createElement('div')});

        let button = document.createElement('button');
        button.innerHTML = '&#9114'; // Clear Screen Symbol
        button.title = 'Limpiar Mapa';

        this.element.className = 'ol-clear ol-unselectable ol-control';
        this.element.appendChild(button);

 
        this.cleaneables = new Collection();
        this.hardDelete = hardDelete || false;
        // this.set('element', element);
        this.setProperties(options);
 
        button.addEventListener('click', this.clean2.bind(this), false);
    }

    private clean2(): void {
        this.getMap().getOverlays().getArray().forEach((overlay: Overlay) => {
            // Fix: Ofrecer una alternativa para borrar solo Overlays especificos
            // Por ejemplo los que tienen la etiqueta css overlay-removible
            // if (overlay.getElement().style.)

            this.getMap().removeOverlay(overlay);
        });
        this.getMap().getLayers().getArray().forEach((layer: Layer) => {
            if (layer instanceof VectorLayer){
                layer.getSource().clear();
                this.getMap().removeLayer(layer);
            }
        });
    }

    private clean(): void {
        this.cleaneables.getArray().forEach((element: VectorLayer) => {
            element.getSource().clear();
            if (this.hardDelete) {
                this.getMap().removeLayer(element);
            }
        });
    }

    subscribeLayer(layer: VectorLayer): void {
        this.cleaneables.push(layer);
    }
}