import React, { Component } from 'react';

const HEIGHT = 400;
const WIDTH = 400;

class Bird extends Component {
    constructor() {
        super();

        this.renderTopography = this.renderTopography.bind(this);
        this.renderNoise = this.renderNoise.bind(this);
        this.renderX = this.renderX.bind(this);
        this.renderShot = this.renderShot.bind(this);
        this.findQuad = this.findQuad.bind(this);
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

    renderX(point) {
        const x = point[0];
        const y = point[1];
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
            <path d={path} stroke={point[2] || '#f7c8d8'} strokeWidth='2' strokeLinecap='round' fill='transparent' />
        )
    }

    renderShot(start, end, blam) {
        const xOrigin = start[0], yOrigin = start[1];
        const xTarget = end[0], yTarget = end[1];
        const xDest = blam[0], yDest = blam[1];

        return (
            <>
                <path d={`M ${xOrigin} ${yOrigin} L ${xDest} ${yDest}`} stroke={`url(#bird-shot)`} fill='transparent' />
                <circle cx={xDest} cy={yDest} r='10' fill={end[2]} />
            </>
        )
    }

    findQuad(start, end) {
        const xDir = end[0] - start[0];
        const yDir = end[1] - start[1];

        let quad;
        if (xDir < 0) {
            if (yDir >= 0)
                quad = 1;
            else quad = 4;
        }
        else {
            if (yDir >= 0)
                quad = 2;
            else quad = 3;
        }

        switch (quad) {
            case 1:
                return ['80%', '20%', '20%', '80%'];
            case 2:
                return ['20%', '20%', '80%', '80%'];
            case 3:
                return ['20%', '80%', '80%', '20%'];
            case 4:
                return ['80%', '80%', '20%', '20%'];
        }
    }

    render() {
        const { start, end, blam, grid, showNoise, selectPosition, marker } = this.props;

        const per = this.findQuad(start, end);

        return (
            <div id='bird-container'>
                <label id='bird-label' htmlFor='bird-svg'>Bird's Eye View</label>
                <svg id='bird-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`} onClick={(e) => { e.persist(); selectPosition(marker, e); }}>
                    <defs>
                        <linearGradient id='bird-shot' x1={per[0]} y1={per[1]} x2={per[2]} y2={per[3]}>
                            <stop offset='0%' stopColor={start[2]} />
                            <stop offset='100%' stopColor={end[2]} />
                        </linearGradient>
                    </defs>
                    {showNoise ? this.renderNoise(grid) : this.renderTopography(grid)}
                    {typeof start === 'object' && start[0] >= 0 && start[1] >= 0 ? this.renderX(start) : null}
                    {typeof end === 'object' && end[0] >= 0 && end[1] >= 0 ? this.renderX(end) : null}
                    {typeof blam === 'object' && blam[0] !== false && blam[1] !== false ? this.renderShot(start, end, blam) : null}
                </svg>
            </div >
        );
    }
}

export default Bird;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths