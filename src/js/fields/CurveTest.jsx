import React, { Component } from 'react';

const HEIGHT = 200;
const WIDTH = 200;

class CurveTest extends Component {
    constructor() {
        super();

        this.buildArc = this.buildArc.bind(this);
    }

    buildArc() {
        const startPoint = [this.props.startPoint[0], HEIGHT - this.props.startPoint[1]];
        const controlPoint = [this.props.controlPoint[0], HEIGHT - this.props.controlPoint[1]];
        const endPoint = [this.props.endPoint[0], HEIGHT - this.props.endPoint[1]];

        let pathData = [];

        if (startPoint && typeof startPoint === 'object') {
            pathData.push('M');
            pathData.push(startPoint[0] || '0', startPoint[1] || '0');
        }
        else throw new Error('startPoint is undefined or not an object >:(');

        if (controlPoint && typeof controlPoint === 'object') {
            pathData.push('Q');
            pathData.push(controlPoint[0] || '0', controlPoint[1] || '0');
        }
        else throw new Error('controlPoint is undefined or not an object >:(');

        if (endPoint && typeof endPoint === 'object') {
            pathData.push(endPoint[0] || '0', endPoint[1] || '0');
        }
        else throw new Error('endPoint is undefined or not an object >:(');

        return pathData.join(' ');
    }

    render() {
        return (
            <div id='curve-div'>
                <label id='curve-label' htmlFor='curve-svg'>Curve Test</label>
                <svg id='curve-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`}>
                    <path stroke='black' d={this.buildArc()} fill='transparent'></path>
                </svg>
            </div>
        );
    }
}

export default CurveTest;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths