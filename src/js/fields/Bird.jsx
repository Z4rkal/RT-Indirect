import React, { Component } from 'react';

const HEIGHT = 400;
const WIDTH = 400;

class Bird extends Component {
    constructor() {
        super();

        this.renderTopography = this.renderTopography.bind(this);
        this.renderNoise = this.renderNoise.bind(this);
        this.renderX = this.renderX.bind(this);
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

    renderX(start) {
        const x = start[0];
        const y = start[1];
        const halfLength = 10;

        let path = `M ${x} ${y}`;
        path += ` L ${Math.min(Math.max(x + halfLength, 0), WIDTH)} ${Math.min(Math.max(y + halfLength, 0), HEIGHT)}`;
        path += `M ${x} ${y}`;
        path += ` L ${Math.min(Math.max(x - halfLength, 0), WIDTH)} ${Math.min(Math.max(y + halfLength, 0), HEIGHT)}`;
        path += `M ${x} ${y}`;
        path += ` L ${Math.min(Math.max(x + halfLength, 0), WIDTH)} ${Math.min(Math.max(y - halfLength, 0), HEIGHT)}`;
        path += `M ${x} ${y}`;
        path += ` L ${Math.min(Math.max(x - halfLength, 0), WIDTH)} ${Math.min(Math.max(y - halfLength, 0), HEIGHT)}`;

        return (
            <path d={path} stroke='#f73979' strokeWidth='2' strokeLinecap='round' fill='transparent' />
        )
    }

    render() {
        const { start, grid, showNoise, selectPosition } = this.props;

        return (
            <div id='bird-container'>
                <label id='bird-label' htmlFor='bird-svg'>Bird's Eye View</label>
                <svg id='bird-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`} onClick={(e) => { e.persist(); selectPosition(e); }}>
                    {showNoise ? this.renderNoise(grid) : this.renderTopography(grid)}
                    {typeof start === 'object' && start[0] >= 0 && start[1] >= 0 ? this.renderX(start) : null}
                </svg>
            </div>
        );
    }
}

export default Bird;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths