import Control, { Options as ControlOptions } from 'ol/control/Control';
import { Extent } from 'ol/extent';
import { Size } from 'ol/size';
import { Collection } from 'ol';

interface Move {
    extent: Extent;
    size: Size
    zoom: number;
}

export default class BackNextControl extends Control {

    history: Move[];

    isUndoRedo;
    size;

    myListener: any;


    constructor(options?: ControlOptions) {
        super({ target: options.target, element: document.createElement('div') });

        let undobtn = document.createElement('button');
        let redobtn = document.createElement('button');

        undobtn.innerHTML = '&#8630'; //Undo Unicode Symbol
        undobtn.title = 'Deshacer';

        redobtn.innerHTML = '&#8631'; //Redo Unicode Symbol
        redobtn.title = 'Rehacer';

        this.element.className = 'ol-backnext ol-unselectable ol-control';

        this.element.appendChild(redobtn);
        this.element.appendChild(undobtn);

        this.isUndoRedo = false;
        this.size = 0;
        this.history = [];

        setTimeout(this.startControl.bind(this), 3000);


        undobtn.addEventListener('click', this.undo.bind(this), false);
        redobtn.addEventListener('click', this.redo.bind(this), false);


    }

    redo(): void {
        console.log(this.history);
        if (this.size < (this.history.length - 1)) {
            this.isUndoRedo = true;
            this.getMap().getView().fit(
                this.history[this.size + 1].extent,
                { size: this.history[this.size + 1].size });

            this.getMap().getView().setZoom(this.history[this.size + 1].zoom);
            setTimeout(function () {
                this.isUndoRedo = false;
            }, 360);
            this.size = this.size + 1;
        }
    }

    undo(): void {
        console.log(this.history);
        if (this.size > 0) {
            this.isUndoRedo = true;
            console.log("Back" + this.size);
            this.getMap().getView().fit(
                this.history[this.size - 1].extent,
                { size: this.history[this.size - 1].size });
            this.getMap().getView().setZoom(this.history[this.size - 1].zoom);
            setTimeout(() => {
                this.isUndoRedo = false;
            }, 360);
            this.size = this.size - 1;
        }
    }


    startControl(): void {
        let move: Move;

        this.myListener = () => {
            if (!this.isUndoRedo) {
                move = {
                    extent: this.getMap().getView().calculateExtent(this.getMap().getSize()),
                    size: this.getMap().getSize(),
                    zoom: this.getMap().getView().getZoom()
                };
                this.history.push(move);
                this.size = this.size + 1;
            }
        };

        this.getMap().on('moveend', this.myListener);
    }

}