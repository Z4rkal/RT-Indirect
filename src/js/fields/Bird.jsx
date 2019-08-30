import React, { Component } from 'react';

const HEIGHT = 400;
const WIDTH = 400;

class Bird extends Component {
    constructor() {
        super();

        this.renderGrid = this.renderGrid.bind(this);
    }

    renderGrid(grid) {
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
                    {this.renderGrid(this.props.grid)}
                </svg>
            </div>
        );
    }
}

export default Bird;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths