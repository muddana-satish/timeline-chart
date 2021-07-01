import { TimeGraphStateController } from "../time-graph-state-controller";
import { TimeGraphUnitController } from "../time-graph-unit-controller";
import { TimeGraphComponent, TimeGraphStyledRect } from "./time-graph-component";

export class TimeGraphNavigatorHandle extends TimeGraphComponent<null> {

    protected mouseIsDown: boolean;
    protected mouseStartX: number;
    protected oldViewStart: number;

    constructor(protected unitController: TimeGraphUnitController, 
        protected stateController: TimeGraphStateController, 
        protected _options: TimeGraphStyledRect) {
        super('navigator_handle');


        const MIN_NAVIGATOR_WIDTH = 20;
        const xPos = this.unitController.viewRange.start * this.stateController.absoluteResolution;
        const effectiveAbsoluteRange = this.unitController.absoluteRange * this.stateController.absoluteResolution;
        // Avoid the navigator rendered outside of the range at high zoom levels when its width is capped to MIN_NAVIGATOR_WIDTH
        this._options.position = { x: Math.min(effectiveAbsoluteRange - MIN_NAVIGATOR_WIDTH, xPos), y: 0 };
        this._options.width = Math.max(MIN_NAVIGATOR_WIDTH, this.unitController.viewRangeLength * this.stateController.absoluteResolution);


        this.addEvent('mousedown', this.mouseDownHandler, this._displayObject);
        this.addEvent('mousemove', this.mouseMoveHandler, this._displayObject);
        this.addEvent('mouseup', this.mouseUpHandler, this._displayObject);
        this.addEvent('mouseupoutside', this.mouseUpHandler, this._displayObject);
    }

    private mouseDownHandler(event: PIXI.InteractionEvent) {
        this.mouseStartX = event.data.global.x;
        this.oldViewStart = this.unitController.viewRange.start;
        this.mouseIsDown = true;
    }

    private mouseMoveHandler(event: PIXI.InteractionEvent) {
        if (this.mouseIsDown) {
            const delta = event.data.global.x - this.mouseStartX;
            var start = Math.max(this.oldViewStart + (delta / this.stateController.absoluteResolution), 0);
            start = Math.min(start, this.unitController.absoluteRange - this.unitController.viewRangeLength);
            const end = Math.min(start + this.unitController.viewRangeLength, this.unitController.absoluteRange)
            this.unitController.viewRange = {
                start,
                end
            }
        }
    }

    private mouseUpHandler() {
        this.mouseIsDown = false;
    }

    render(): void {
        this.rect({
            height: this._options.height,
            position: this._options.position,
            width: this._options.width,
            color: this._options.color //0xff0000,//0x777769
        })
    }

    update(opts?: TimeGraphStyledRect): void {
        if (opts) {
            this._options.position = opts.position;
            this._options.width = opts.width;
            this._options.color = opts.color;
        }
        super.update();
    }
}