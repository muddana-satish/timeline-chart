import { TimeGraphRectangle } from "../components/time-graph-rectangle";
import { TimelineChart } from "../time-graph-model";
import { TimeGraphLayer } from "./time-graph-layer";

export class TimeGraphRangeEventsLayer extends TimeGraphLayer {
    protected rangeEvents: Map<TimelineChart.TimeGraphAnnotation, TimeGraphRectangle>;

    protected color: number = 0x0000ff;
    private _viewRangeUpdateHandler: { (): void; (viewRange: TimelineChart.TimeGraphRange): void; (viewRange: TimelineChart.TimeGraphRange): void; };
    private _updateHandler: { (): void; (selectionRange: TimelineChart.TimeGraphRange): void; (selectionRange: TimelineChart.TimeGraphRange): void; };

    constructor(id: string, style?: { color?: number }) {
        super(id);
        if (style && style.color) {
            this.color = style.color;
        }
    }

    protected afterAddToContainer() {
        this._updateHandler = (): void => this.update();
        this.unitController.onViewRangeChanged(this._updateHandler);
    }

    protected addRangeEvent(rangeEvent: TimelineChart.TimeGraphAnnotation) {
        const start = this.getPixels(rangeEvent.range.start - this.unitController.viewRange.start);
        const end = this.getPixels(rangeEvent.range.end - this.unitController.viewRange.start);
        const width = end - start;
        const rangeEventComponent = new TimeGraphRectangle({
            color: this.color,
            opacity: 0.2,
            position: {
                x: start,
                y: 0
            },
            height: this.stateController.canvasDisplayHeight,
            width
        });
        this.rangeEvents.set(rangeEvent, rangeEventComponent);
        this.addChild(rangeEventComponent);
    }

    addRangeEvents(rangeEvents: TimelineChart.TimeGraphAnnotation[]): void {
        if (!this.stateController) {
            throw ('Add this TimeGraphChartArrows to a container before adding arrows.');
        }
        if (this.rangeEvents) {
            this.removeChildren();
        }
        this.rangeEvents = new Map();
        rangeEvents.forEach(arrow => {
            this.addRangeEvent(arrow);
        })
    }

    update(): void {
        if (this.rangeEvents) {
            for (const arrow of this.rangeEvents.keys()) {
                this.updateRangeEvent(arrow);
            }
        }
    }

    protected updateRangeEvent(rangeEvent: TimelineChart.TimeGraphAnnotation) {
        const rangeEventComponent = this.rangeEvents.get(rangeEvent);
        const start = this.getPixels(rangeEvent.range.start - this.unitController.viewRange.start);
        const end = this.getPixels(rangeEvent.range.end - this.unitController.viewRange.start);
        const width = end - start;
        if (rangeEventComponent) {
            rangeEventComponent.update({
                position: {
                    x: start,
                    y: 0
                },
                height: this.stateController.canvasDisplayHeight,
                width
            });
        }
    }

    destroy() : void {
        if (this.unitController) {
            this.unitController.removeViewRangeChangedHandler(this._viewRangeUpdateHandler);
            this.unitController.removeSelectionRangeChangedHandler(this._updateHandler);
        }
        super.destroy();
    }
}