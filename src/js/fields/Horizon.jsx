import React, { Component } from 'react';
import { type } from 'os';

const HEIGHT = 400;
const WIDTH = 400;

const VELOCITY = 82.28;

class Horizon extends Component {
    constructor() {
        super();

        this.buildHorizonView = this.buildHorizonView.bind(this);
    }

    //TODO: Split this into multiple functions so that the various bits of jsx can get stored in the state
    //And we can update pieces individually
    buildHorizonView(grid, alpha, direction, start, end, blam) {
        const spacing = grid.length / 50;
        const height = grid.length, width = grid.length;

        let sum = 0;
        let count = 0;
        let lines = [];

        let n = 0;

        switch (direction) {
            default:
            case 'north':
                for (let y = 0; y < height; y += spacing) {
                    lines[n] = [];
                    for (let x = 0; x < width; x++) {
                        sum = 0;
                        count = 0;
                        for (let i = 0; i < spacing && i + y < height; i++) {
                            sum += grid[y + i][x];
                            count++;
                        }
                        lines[n][x] = sum / count;
                    }
                    n++;
                }
                break;
            case 'east':
                n = Math.floor(height / spacing) - 1;
                for (let x = 0; x < width; x += spacing) {
                    lines[n] = [];
                    for (let y = height - 1; y >= 0; y--) {
                        sum = 0;
                        count = 0;
                        for (let i = 0; i < spacing && x - i >= 0; i++) {
                            sum += grid[y][x - i];
                            count++;
                        }
                        lines[n][y] = sum / count;
                    }
                    n--;
                }
                break;
            case 'south':
                for (let y = height - 1; y >= 0; y !== 0 ? y -= spacing : y = -1) {
                    lines[n] = [];
                    for (let x = 0; x < width; x++) {
                        sum = 0;
                        count = 0;
                        for (let i = 0; i < spacing && y - i >= 0; i++) {
                            sum += grid[y - i][x];
                            count++;
                        }
                        lines[n][width - 1 - x] = sum / count;
                    }
                    n++;
                }
                break;
            case 'west':
                for (let x = 0; x < width; x += spacing) {
                    lines[n] = [];
                    for (let y = height - 1; y >= 0; y--) {
                        sum = 0;
                        count = 0;
                        for (let i = 0; i < spacing && x - i >= 0; i++) {
                            sum += grid[y][x - i];
                            count++;
                        }
                        lines[n][height - 1 - y] = sum / count;
                    }
                    n++;
                }
        }

        let startX = -1;
        let startY = -1;
        let startProp = false;
        let startLine = false;
        if (lines && typeof start === 'object' && start[0] >= 0 && start[1] >= 0) {
            switch (direction) {
                default:
                case 'north':
                    startX = Math.floor(start[0] / this.props.scale);
                    startY = Math.floor(start[1] / (this.props.scale * spacing));
                    break;
                case 'east':
                    startX = Math.floor(start[1] / this.props.scale);
                    startY = Math.floor((WIDTH - start[0]) / (this.props.scale * spacing));
                    break;
                case 'south':
                    startX = Math.floor((WIDTH - start[0]) / this.props.scale);
                    startY = Math.floor((HEIGHT - start[1]) / (this.props.scale * spacing));
                    break;
                case 'west':
                    startX = Math.floor((HEIGHT - start[1]) / this.props.scale);
                    startY = Math.floor(start[0] / (this.props.scale * spacing));
                    break;
            }

            if (startY >= lines.length) {
                startY = lines.length - 1;
            }

            if (startX >= (lines[startY]).length) {
                startX = (lines[startY]).length - 1;
            }

            if (lines[startY]) {
                let rectX = startX * this.props.scale + this.props.scale - 1;
                let rectY = 400 - (lines[startY][startX] * 400);
                startLine = startY;

                startProp = (<rect x={rectX} y={rectY - 40} height='40' width='3' fill={start[2] || '#f7c9d9'} />);
            }
            else console.log(startY);
        }

        let endX = -1;
        let endY = -1;
        let endProp = false;
        let endLine = false;
        if (lines && typeof end === 'object' && end[0] >= 0 && end[1] >= 0) {
            switch (direction) {
                default:
                case 'north':
                    endX = Math.floor(end[0] / this.props.scale);
                    endY = Math.floor(end[1] / (this.props.scale * spacing));
                    break;
                case 'east':
                    endX = Math.floor(end[1] / this.props.scale);
                    endY = Math.floor((WIDTH - end[0]) / (this.props.scale * spacing));
                    break;
                case 'south':
                    endX = Math.floor((WIDTH - end[0]) / this.props.scale);
                    endY = Math.floor((HEIGHT - end[1]) / (this.props.scale * spacing));
                    break;
                case 'west':
                    endX = Math.floor((HEIGHT - end[1]) / this.props.scale);
                    endY = Math.floor(end[0] / (this.props.scale * spacing));
                    break;
            }

            if (endY >= lines.length) {
                endY = lines.length - 1;
            }

            // if(endY < 0) {
            //     endY = 0;
            // }

            if (endX >= (lines[endY]).length) {
                endX = (lines[endY]).length - 1;
            }

            // if(endX < 0) {
            //     endX = 0;
            // }

            if (lines[endY]) {
                let rectX = endX * this.props.scale + this.props.scale - 1;
                let rectY = 400 - (lines[endY][endX] * 400);
                endLine = endY;

                endProp = (<rect x={rectX} y={rectY - 40} height='40' width='3' fill={end[2] || '#a700a7'} />);
            }
            else console.log(endY);
        }

        let destX = -1;
        let destY = -1;
        let points;
        let shot = false;
        if (typeof blam === 'object' && typeof blam[0] === 'number' && typeof blam[1] === 'number') {
            switch (direction) {
                default:
                case 'north':
                    destX = Math.floor(blam[0] / this.props.scale);
                    destY = Math.floor(blam[1] / (this.props.scale * spacing));
                    break;
                case 'east':
                    destX = Math.floor(blam[1] / this.props.scale);
                    destY = Math.floor((WIDTH - blam[0]) / (this.props.scale * spacing));
                    break;
                case 'south':
                    destX = Math.floor((WIDTH - blam[0]) / this.props.scale);
                    destY = Math.floor((HEIGHT - blam[1]) / (this.props.scale * spacing));
                    break;
                case 'west':
                    destX = Math.floor((HEIGHT - blam[1]) / this.props.scale);
                    destY = Math.floor(blam[0] / (this.props.scale * spacing));
                    break;
            }



            let ΔX = (destX - startX) * this.props.scale;
            let ΔY = -(destY - startY) * this.props.scale * spacing;
            let ΔZ;
            let finalZ;

            if (destY >= lines.length || destY < 0 || destX >= lines[destY].length || destX < 0) {
                finalZ = 400;
                ΔZ = (400 - lines[startY][startX] * 400) - 400;
            }
            else {
                finalZ = 400 - (lines[destY][destX] * 400);
                ΔZ = (400 - (lines[startY][startX] * 400)) - (400 - (lines[destY][destX] * 400));
            }

            let dist = Math.sqrt(Math.pow((destX - startX) * this.props.scale, 2) + Math.pow((destY - startY) * this.props.scale * spacing, 2));

            //console.log(`ΔX: ${ΔX}, ΔY: ${ΔY}, ΔZ: ${ΔZ}`);
            let øZ = Math.atan((Math.pow(VELOCITY, 2) + Math.sqrt(Math.pow(VELOCITY, 4) - 9.8 * (9.8 * Math.pow(dist, 2) + 2 * ΔZ * Math.pow(VELOCITY, 2)))) / (9.8 * dist));
            //console.log(`Dist: ${dist}, øZ: ${180 / Math.PI * øZ}`);

            let øXY = Math.atan2(ΔY, ΔX); //(Math.PI * direction) / 180 + 
            //console.log(`øXY: ${180 / Math.PI * øXY}`);

            let t = dist / (VELOCITY * Math.cos(øZ));

            let cX = Math.cos(øXY);
            //console.log(cX);

            let cY = Math.sin(øXY);
            //console.log(cY);

            points = new Array(Math.ceil(t * 10));
            points = points.fill(1, 0, points.length);

            let prevPoint = [startX * this.props.scale + this.props.scale, 400 - (lines[startY][startX] * 400)];
            points = points.map((point, pIndex) => {
                if (pIndex !== points.length - 1) {
                    let d = `M ${prevPoint[0]} ${prevPoint[1]}`;
                    let xt = prevPoint[0] + (VELOCITY * (0.1) * cX * Math.cos(øZ));
                    let zt = 400 - (lines[startY][startX] * 400) - (VELOCITY * ((pIndex + 1) / 10) * Math.sin(øZ) - 1 / 2 * 9.8 * Math.pow((pIndex + 1) / 10, 2));
                    d += ` L ${xt} ${zt}`;
                    prevPoint = [xt, zt];
                    let zIndex = Math.max(Math.min(Math.floor(startY - (VELOCITY * ((pIndex + 1) / 10) * cY * Math.cos(øZ) / (this.props.scale * spacing))), lines.length - 1), 0);
                    return [d, zIndex];
                }
                else {
                    //console.log(`last natural Z: ${prevPoint[1]}, target Z: ${finalZ}`);
                    let d = `M ${prevPoint[0]} ${prevPoint[1]}`;
                    let xt = destX * this.props.scale + this.props.scale;
                    let zt = finalZ;
                    d += ` L ${xt} ${zt}`;
                    prevPoint = [xt, zt];
                    let zIndex = Math.max(Math.min(Math.floor(startY - (VELOCITY * ((pIndex + 1) / 10) * cY * Math.cos(øZ) / (this.props.scale * spacing))), lines.length - 1), 0);
                    return [d, zIndex];
                }
            });

            shot = true;
            
            // = (
            //     <>
            //         {points.map((point, pIndex) => (
            //             <path key={pIndex} d={point[0]} stroke='#f7c8d8' fill='transparent' />
            //         ))}
            //     </>
            // );
        }



        return (
            <>
                {
                    lines.map((col, cIndex) => {
                        let hex = 255 - (cIndex * 4);
                        return (
                            <React.Fragment key={`line ${cIndex}`}>
                                {startProp && startLine === cIndex ? startProp : null}
                                {endProp && endLine === cIndex ? endProp : null}
                                {shot ? points.filter((point) => point[1] === cIndex).map((point,pIndex) => (
                                    <path key={pIndex} d={point[0]} stroke='#f7c8d8' fill='transparent' />
                                )) : null}
                                <path d={`M 0 400 L 0 ${400 - (col[0] * 400)} ${col.reduce((prev, value, rIndex) => {
                                    value = 400 - (value * 400)
                                    return prev + (` L ${rIndex * this.props.scale + this.props.scale} ${value}`)
                                }, '')} L 400 400`} stroke={`rgb(${hex},${hex * 1.25},${hex * 1.25})`} fill={`rgb(${hex},${hex * 1.25},${hex * 1.25}${alpha ? `,${1 / ((cIndex + 1) / 1)})` : ``}`} />
                            </React.Fragment>);
                    })
                }
                {null}
            </>
        )
    }

    render() {
        const { start, end, blam, grid, alpha, direction } = this.props;

        return (
            <div id='horizon-container'>
                <label id='horizon-label' htmlFor='horizon-svg'>Horizon View</label>
                <svg id='horizon-svg' height={`${HEIGHT}px`} width={`${WIDTH}px`}>
                    <rect x='0' y='0' height={HEIGHT} width={WIDTH} fill='#ffffff' />
                    {this.buildHorizonView(grid, alpha, direction, start, end, blam)}
                </svg>
            </div>
        );
    }
}

export default Horizon;

//https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

/*  Math Notes
    Have:
        -v = 82.28m/s
        -d = (dist)m;
        -g = 9.8m/s²

    Need Theta (ø) and time (t):

    82.28m/s * cos(ø) * t = d
    t = d / (82.28m/s * cos(ø))

    82.28m/s * sin(ø) * t - 1/2 * 9.8m/s² * t² = 0m
    t(82.28m/s * sin(ø) - 1/2 * 9.8m/s² * t) = 0m

    t = 0 is solution one, but we don't care about it

    82.28m/s * sin(ø) - 1/2 * 9.8m/s² * t = 0m
    82.28m/s * sin(ø) = 1/2 * 9.8m/s² * t
    sin(ø) = 1/2 * 9.8m/s² * t / 82.28m/s
    sin(ø) = 1/2 * 9.8m/s² * t / 82.28m/s

    t = d / (82.28m/s * cos(ø))

    sin(ø) = 1/2 * 9.8m/s² * d / ((82.28m/s)² * cos(ø))
    sin(ø)cos(ø) = 1/2 * 9.8m/s² * d / 6769.9984m²/s²

    sin(ø)cos(ø) = sin(2ø)/2

    sin(2ø) = 9.8m/s² * d / 6769.9984m²/s²
    2ø = sin⁻¹(9.8m/s² * d / 6769.9984m²/s²)
    ø = sin⁻¹(9.8m/s² * d / 6769.9984m²/s²) / 2

    Formula: ø = 180/π * sin⁻¹(g * d / v²) / 2

    //New formula w/ Height From several places online:

    tan(ø) = (v² ± √(v⁴ - g(gx² + 2yv²))) / gx

    we want the positive solution if it exists

    so:

    ø = atan(v₀² + √(v₀⁴ - g(gd² + 2h₂v₀²))) / gd
*/