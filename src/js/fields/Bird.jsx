import React, { Component } from 'react';

const HEIGHT = 400;
const WIDTH = 400;

class Bird extends Component {
    constructor() {
        super();

        this.renderNoise = this.renderNoise.bind(this);
        this.renderTopography = this.renderTopography.bind(this);
    }

    renderTopography(grid) {
        return (
            <>
                {grid.map((col, cIndex) => (
                    <React.Fragment key={`Column: ${cIndex}`} >
                        {col.map((value, rIndex) => {
                            value = Math.round(value * 15);
                            let hex = 5 + value * 16.7;
                            return (<rect key={`${cIndex}, ${rIndex}`} x={rIndex * this.props.scale} y={cIndex * this.props.scale} height='10' width='10' fill={`rgb(${hex},${hex * 1.25},${hex * 1.25})`} />);
                        })}
                    </React.Fragment>
                ))}
            </>
        )
    }

    renderNoise(grid) {
        return (
            <>
                {grid.map((col, cIndex) => (
                    <React.Fragment key={cIndex} >
                        {col.map((value, rIndex) => {
                            value = 255 * value;
                            return (<rect key={`${cIndex}, ${rIndex}`} x={rIndex * this.props.scale} y={cIndex * this.props.scale} height='10' width='10' fill={`rgb(${value},${value},${value})`} />)
                        })}
                    </React.Fragment>
                ))}
            </>
        )
    }

    render() {
        return (
            <div id='bird-container'>
                <label id='bird-label' htmlFor='bird-svg'>Bird's Eye View</label>
                <svg id='bird-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`}>
                    {this.props.showNoise ? this.renderNoise(this.props.grid) : this.renderTopography(this.props.grid)}
                </svg>
            </div>
        );
    }
}

export default Bird;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths