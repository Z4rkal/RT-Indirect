import React, { Component } from 'react';

const HEIGHT = 400;
const WIDTH = 400;

const alpha = false;

class Horizon extends Component {
    constructor() {
        super();

        this.buildTopography = this.buildTopography.bind(this);
    }

    buildTopography(grid) {
        const spacing = grid.length / 50;
        const height = grid.length, width = grid.length;

        let sum = 0;
        let lines = [];

        for (let y = 0; y < height; y += spacing) {
            lines[y / spacing] = [];
            for (let x = 0; x < width; x++) {
                sum = 0;
                for (let i = 0; i < spacing && i + y < height; i++) {
                    sum += grid[y + i][x];
                }
                lines[y / spacing][x] = sum / spacing;
            }
        }

        return (
            <>
                {lines.map((col, cIndex) => {
                    let hex = 255 - (cIndex * 4);
                    return (<path key={`line ${cIndex}`} d={`M 0 400 L 0 ${400 - (col[0] * 400)} ${col.reduce((prev,value, rIndex) => {
                        value = 400 - (value * 400)
                        return prev + (` L ${rIndex * this.props.scale + this.props.scale} ${value}`)
                    },'')} L 400 400`} stroke={`rgb(${hex},${hex * 1.25},${hex * 1.25})`} fill={`rgb(${hex},${hex * 1.25},${hex * 1.25}${alpha ? `,${1 / ((cIndex + 1) / 1)})` : ``}`} />);
                })}
            </>
        )
    }

    render() {
        return (
            <div id='horizon-container'>
                <label id='horizon-label' htmlFor='horizon-svg'>Horizon View</label>
                <svg id='horizon-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`}>
                    <rect x='0' y='0' height={HEIGHT} width={WIDTH} fill='#000000' />
                    {this.buildTopography(this.props.grid)}
                </svg>
            </div>
        );
    }
}

export default Horizon;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths