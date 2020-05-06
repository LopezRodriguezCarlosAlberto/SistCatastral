import Control, { Options as ControlOptions } from 'ol/control/Control';
import VectorLayer from 'ol/layer/Vector';
import Collection from 'ol/Collection';
import * as jsPDF from 'jspdf';

export default class PrintControl extends Control {

    private hardDelete;

    private cleaneables: Collection<VectorLayer>;
    // 
    constructor(options?: ControlOptions) {
        super({ target: options.target, element: document.createElement('div') });

        let button = document.createElement('button');
        button.innerHTML = '&#9113'; // Print Screen Symbol
        button.title = 'Imprimir';

        this.element.className = 'ol-print ol-unselectable ol-control';
        this.element.appendChild(button);

        this.setProperties(options);

        button.addEventListener('click', this.print, false);
    }

    /** TODO : puede sustuirse con una inyection de dependencias */
    private print() {
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


    subscribeLayer(layer: VectorLayer): void {
        this.cleaneables.push(layer);
    }
}