import { Draw } from 'ol/interaction';
import { Options as DrawOptions, DrawEvent } from 'ol/interaction/Draw';
import { MapBrowserPointerEvent, Overlay, Feature } from 'ol';
import { EventsKey } from 'ol/events';
import { Coordinate } from 'ol/coordinate';
import Polygon from 'ol/geom/Polygon';
import BaseEvent from 'ol/events/Event';
import { unByKey } from 'ol/Observable';
import LineString from 'ol/geom/LineString';
import OverlayPositioning from 'ol/OverlayPositioning';
import Geometry from 'ol/geom/Geometry';


export default class MeasureDrawInteraction extends Draw {
    sketch: Feature;
    helpTooltipElement: HTMLElement;
    helpTooltip: Overlay;
    measureTooltipElement: HTMLElement;
    measureTooltip: Overlay;
    continuePolygonMsg: string;
    continueLineMsg: string;
    isDrawing: boolean;

    constructor(options: DrawOptions) {
        super(options);
        this.continuePolygonMsg = 'Click to continue drawing the polygon';
        this.continueLineMsg = 'Click to continue drawing the line';
        this.isDrawing = false;

        let listener: EventsKey;
        this.on('drawstart',
            (evt: DrawEvent) => {
                // set sketch
                this.sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                let tooltipCoord: Coordinate;// = evt.target.getCoordinates();

                listener = this.sketch.getGeometry().on('change', (event: BaseEvent) => {
                    let geom = event.target;
                    let output;
                    if (geom instanceof Polygon) {
                        output = this.formatArea(geom);

                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = this.formatLength(geom);

                        tooltipCoord = geom.getLastCoordinate();
                    }
                    this.measureTooltipElement.innerHTML = output;
                    this.measureTooltip.setPosition(tooltipCoord);
                });
            });

        this.on('drawend',
            () => {
                this.isDrawing = false;
                if (this.helpTooltipElement) {
                    this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
                }
                this.helpTooltipElement = null;

                this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                this.measureTooltip.setOffset([0, -7]);
                // unset sketch
                this.sketch = null;
                // unset tooltip so that a new one can be created
                this.measureTooltipElement = null;
                this.createMeasureTooltip();
                unByKey(listener);
            });
    }

    handleMoveEvent(mapBrowserEvent: MapBrowserPointerEvent): void {
        if (!this.helpTooltipElement && !this.isDrawing){
            this.isDrawing = true;
            this.createHelpTooltip();
            this.createMeasureTooltip();
            // this.getMap().render();
        }
        let helpMsg = 'Click to start drawing';

        if (this.sketch) {
            const geom: Geometry = this.sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = this.continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = this.continueLineMsg;
            }
        }
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(mapBrowserEvent.coordinate);
        this.helpTooltipElement.classList.remove('hidden');


        super.handleMoveEvent(mapBrowserEvent);
    }

    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength(line: LineString): string {
        let length: number = line.getLength();
        let output: string;
        if (length > 1000) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    }


    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea(polygon: Polygon): string {
        let area: number = polygon.getArea();
        let output: string;
        if (area > 1000) {
            output = (Math.round(area / 1000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    }

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip(): void {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }

        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: OverlayPositioning.CENTER_LEFT
        });
        this.getMap().addOverlay(this.helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(): void {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';

        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: OverlayPositioning.BOTTOM_CENTER
        });
        this.getMap().addOverlay(this.measureTooltip);
    }



}