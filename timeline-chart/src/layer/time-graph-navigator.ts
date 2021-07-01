import { TimeGraphStyledRect } from "../components/time-graph-component";
import { TimeGraphRectangle } from "../components/time-graph-rectangle";
import { TimeGraphLayer } from "./time-graph-layer";
import { TimelineChart } from "../time-graph-model";
import { TimeGraphNavigatorHandle } from "../components/time-graph-navigator-handler";

export class TimeGraphNavigator extends TimeGraphLayer {

    protected navigatorHandle: TimeGraphNavigatorHandle;
    protected selectionRange?: TimeGraphRectangle;
    private _updateHandler: { (): void; (viewRange: TimelineChart.TimeGraphRange): void; (selectionRange: TimelineChart.TimeGraphRange): void; (viewRange: TimelineChart.TimeGraphRange): void; (selectionRange: TimelineChart.TimeGraphRange): void; };

    afterAddToContainer() {
        this._updateHandler = (): void => this.update();
        this.unitController.onViewRangeChanged(this._updateHandler);
        this.navigatorHandle = new TimeGraphNavigatorHandle(this.unitController, this.stateController, {height: 20, width: 20, position: {x: 0, y: 0}});
        this.addChild(this.navigatorHandle);
        this.unitController.onSelectionRangeChange(this._updateHandler);
        this.onCanvasEvent('mousedown', this.mouseDownHandler);
        this.update();
    }

    private mouseDownHandler = (e: MouseEvent) => {
        console.log("Orey Konda na kodaka");
    }

    update() {
        this.navigatorHandle.clear();
        this.navigatorHandle.render();

        if (this.unitController.selectionRange) {
            const selectionOpts: TimeGraphStyledRect = {
                color: 0xb7b799,
                height: this.stateController.canvasDisplayHeight,
                opacity: 0.5,
                position: {
                    x: this.unitController.selectionRange.start * this.stateController.absoluteResolution,
                    y: 0
                },
                width: (this.unitController.selectionRange.end - this.unitController.selectionRange.start) * this.stateController.absoluteResolution
            };
            if (!this.selectionRange) {
                this.selectionRange = new TimeGraphRectangle(selectionOpts);
                this.addChild(this.selectionRange);
            } else {
                this.selectionRange.update(selectionOpts);
            }
        } else {
            if (this.selectionRange) {
                this.selectionRange.clear();
            }
        }
    }

    destroy() : void {
        if (this.unitController) {
            this.unitController.removeViewRangeChangedHandler(this._updateHandler);
            this.unitController.removeSelectionRangeChangedHandler(this._updateHandler);
        }
        super.destroy();
    }
}