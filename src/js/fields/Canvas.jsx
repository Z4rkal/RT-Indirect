import React, { Component } from 'react';

const HEIGHT = 200;
const WIDTH = 200;

class Canvas extends Component {
    constructor() {
        super();

        this.state = {
            points: [],
            complete: false,
            hoverPoint: []
        };

        this.clearPoints = this.clearPoints.bind(this);
        this.clearLastPoint = this.clearLastPoint.bind(this);
        this.closePath = this.closePath.bind(this);
        this.placePoint = this.placePoint.bind(this);
        this.placeHoverPoint = this.placeHoverPoint.bind(this);
        this.clearHoverPoint = this.clearHoverPoint.bind(this);
        this.drawPath = this.drawPath.bind(this);
    }

    clearPoints() {
        this.setState({
            points: [],
            complete: false
        });
    }

    clearLastPoint(points) {
        this.setState({
            points: points.slice(0, points.length - 1),
            complete: false
        });
    }

    closePath(points) {
        const firstX = points[0][0];
        const firstY = points[0][1];

        this.setState({
            points: [...points, [firstX, firstY]],
            complete: true,
            hoverPoint: []
        });
    }

    placePoint(event) {
        if (event.nativeEvent) {
            const x = Math.min(Math.max(event.nativeEvent.offsetX, 0), HEIGHT);
            const y = Math.min(Math.max(event.nativeEvent.offsetY, 0), WIDTH);

            if (this.state.points.length === 0 || (x !== this.state.points[this.state.points.length - 1][0] && y !== this.state.points[this.state.points.length - 1][1])) {
                this.setState({
                    points: [...this.state.points, [x, y]]
                });
            }
        }
    }

    placeHoverPoint(event) {
        if (event.nativeEvent) {
            const x = Math.min(Math.max(event.nativeEvent.offsetX, 0), HEIGHT);
            const y = Math.min(Math.max(event.nativeEvent.offsetY, 0), WIDTH);

            this.setState({
                hoverPoint: [x, y]
            });
        }
    }

    clearHoverPoint() {
        this.setState({
            hoverPoint: []
        })
    }

    drawPath(points, hoverPoint, complete) {
        if (points.length === 0 && hoverPoint.length === 0) throw new Error(`drawPath was called with no points in Canvas.jsx`)

        if (points.length === 1 && hoverPoint.length === 0) {
            return <rect x={points[0][0] - 2} y={points[0][1] - 2} width='5' height='5' fill='#f7c8d8' />
        }
        else if (points.length === 0 && hoverPoint.length !== 0) {
            return <rect x={hoverPoint[0] - 2} y={hoverPoint[1] - 2} width='5' height='5' fill='#f7c8d8' />
        }

        return (
            <>
                <path d={points.reduce((dString, point, index) => {
                    if (index === 0 && points.length !== 1)
                        return `M ${point[0]} ${point[1]}`;
                    else if (index === 0)
                        return `M ${point[0]} ${point[1]}` + `${hoverPoint.length !== 0 ? ` L ${hoverPoint[0]} ${hoverPoint[1]}` : ``}`;
                    else if (index === points.length - 1)
                        return dString + ` L ${point[0]} ${point[1]}` + `${hoverPoint.length !== 0 ? ` L ${hoverPoint[0]} ${hoverPoint[1]}` : ``}`;

                    return dString + ` L ${point[0]} ${point[1]}`;
                }, '')} stroke='#f7c8d8' fill={complete ? '#f7c8d8aa' : 'transparent'} />
            </>
        )
    }

    render() {
        const { points, complete, hoverPoint } = this.state;

        return (
            <div id='canvas-div'>
                <button id='canvas-clear' onClick={this.clearPoints}>Clear</button>
                <button id='canvas-undo' onClick={() => this.clearLastPoint(points)}>Undo</button>
                <button id='canvas-path-close' onClick={() => this.closePath(points)} disabled={points.length < 2 || complete}>Complete Path</button>

                <label id='canvas-label' htmlFor='canvas-svg'>Test Canvas</label>
                <svg id='canvas-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`} onClick={(e) => { if (!complete) this.placePoint(e); }} onMouseMove={(e) => {if(!complete) this.placeHoverPoint(e);}} onMouseLeave={this.clearHoverPoint}>
                    {points.length > 0 || hoverPoint.length > 0 ? this.drawPath(points, hoverPoint, complete) : null}
                </svg>
            </div>
        );
    }
}

export default Canvas;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths