import Alea from 'alea';
import React, { Component } from 'react';
import SimplexNoise from 'simplex-noise';
import Bird from '../fields/Bird';
import Horizon from '../fields/Horizon';
import buildGrid from '../lib/buildGrid';



const SIZE = 100;

class Sim extends Component {
    constructor() {
        super();

        this.state = {
            grid: [],
            showNoise: false,
            horizonAlpha: false,
            horizonDirection: 'north',
            markerSelect: false,
            noiseSeed: undefined,
            simplex: undefined,
            start: [-1, -1, '#f73979'],
            end: [-1, -1, '#a700a7'],
            blam: [false, false],
            oct1: 0.80,
            oct2: 0.45,
            oct3: 0.14,
            oct4: 0.07,
            oct5: 0.03,
            oct6: 0.01,
            pow: 4.7
        }

        this.toggleInput = this.toggleInput.bind(this);
        this.updateSeed = this.updateSeed.bind(this);
        this.updateGrid = this.updateGrid.bind(this);
        this.renderArrow = this.renderArrow.bind(this);
        this.selectPosition = this.selectPosition.bind(this);
        this.clearMarkers = this.clearMarkers.bind(this);
        this.canFire = this.canFire.bind(this);
        this.fireMortar = this.fireMortar.bind(this);
    }

    componentDidMount() {
        const random = new Alea()();
        const simplex = new SimplexNoise(random);

        const oct = [this.state.oct1, this.state.oct2, this.state.oct3, this.state.oct4, this.state.oct5, this.state.oct6];
        let grid = buildGrid(SIZE, simplex, random, oct, this.state.pow);

        this.setState({
            noiseSeed: random,
            simplex: simplex,
            grid: grid
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.simplex !== this.state.simplex
            || prevState.oct1 !== this.state.oct1
            || prevState.oct2 !== this.state.oct2
            || prevState.oct3 !== this.state.oct3
            || prevState.oct4 !== this.state.oct4
            || prevState.oct5 !== this.state.oct5
            || prevState.oct6 !== this.state.oct6
            || prevState.pow !== this.state.pow) {
            this.updateGrid();
        }
    }

    updateInput(field, value) {
        if (this.state[field] === undefined) throw new Error(`Invalid field passed into updateInput in Sim.jsx`);

        this.setState({
            [field]: value
        });
    }

    toggleInput(field, value) {
        if (this.state[field] === undefined) throw new Error(`Invalid field passed into toggleInput in Sim.jsx`);

        if (field === 'markerSelect') {
            if (this.state[field] === value) {
                this.setState({
                    [field]: false
                });
            }
            else {
                this.setState({
                    [field]: value
                });
            }
        }
        else if (field !== 'horizonDirection') {
            this.setState({
                [field]: !this.state[field]
            });
        }
        else {
            this.setState({
                [field]: value
            });
        }
    }

    updateSeed() {
        let random = new Alea()();

        this.setState({
            noiseSeed: random,
            simplex: new SimplexNoise(random)
        });
    }

    updateGrid() {
        const oct = [this.state.oct1, this.state.oct2, this.state.oct3, this.state.oct4, this.state.oct5, this.state.oct6];
        let grid = buildGrid(SIZE, this.state.simplex, this.state.noiseSeed, oct, this.state.pow);

        this.setState({
            grid: grid
        });
    }

    renderArrow() {
        let path = '';

        switch (this.state.horizonDirection) {
            default:
            case 'north':
                path = 'M 25 50 L 25 0 L 15 15 M 35 15 L 25 0';
                break;
            case 'east':
                path = 'M 0 25 L 50 25 L 35 35 M 35 15 L 50 25';
                break;
            case 'south':
                path = 'M 25 0 L 25 50 L 15 35 M 35 35 L 25 50';
                break;
            case 'west':
                path = 'M 50 25 L 0 25 L 15 35 M 15 15 L 0 25';
                break;
        }

        return (
            <svg id='direction-svg' width='50' height='50'>
                <path id='arrow-path' d={path} stroke='black' fill='transparent' />
            </svg>
        )
    }

    selectPosition(marker, event) {
        if (marker === false) return;
        if (marker !== 'start' && marker !== 'end') throw new Error(`Invalid marker passed into selectPosition in Sim.jsx`);
        if (event.nativeEvent) {
            const x = Math.min(Math.max(event.nativeEvent.offsetX, 0), 400);
            const y = Math.min(Math.max(event.nativeEvent.offsetY, 0), 400);

            this.setState({
                [marker]: [x, y, this.state[marker][2]]
            });
        }
    }

    clearMarkers() {
        this.setState({
            start: [-1, -1, '#f73979'],
            end: [-1, -1, '#a700a7'],
            blam: [false, false]
        });
    }

    canFire() {
        const { start, end } = this.state;
        if (typeof start !== 'object' || start[0] < 0 || start[1] < 0
            || typeof end !== 'object' || end[0] < 0 || end[1] < 0)
            return true;

        return false;
    }

    fireMortar(start, end) {
        const random = new Alea();
        const x1 = start[0];
        const y1 = start[1];
        const x2 = end[0];
        const y2 = end[1];

        const xDist = x2 - x1;
        const yDist = y2 - y1;
        const dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        const toHit = 0.85;
        const maxError = Math.min(Math.max(dist / 690 * 240, 20), dist / 2);

        const roll = random();

        let blam = [-1, -1];
        if (roll >= toHit) {
            blam = [x2, y2];

            //alert(`Hit: ${blam}`);

            this.setState({
                blam: blam
            });
        }
        else if (roll < toHit) {
            let error = maxError * (1 - (roll / toHit));
            let ø = 360 * random();

            blam = [x2 + Math.cos(ø) * error, y2 + Math.sin(ø) * error];

            //alert(`Miss: ${blam}`);

            this.setState({
                blam: blam
            });
        }
    }

    render() {
        const { oct1, oct2, oct3, oct4, oct5, oct6, pow } = this.state;

        return (
            <>
                <div className='flex-container'>
                    <div id='noise-options-container'>
                        <p id='noise-desc'>Noise Map Parameters:</p>
                        <div>
                            <label>Oct 1 ({oct1.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct1 * 100} onChange={(e) => this.updateInput('oct1', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Oct 2 ({oct2.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct2 * 100} onChange={(e) => this.updateInput('oct2', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Oct 3 ({oct3.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct3 * 100} onChange={(e) => this.updateInput('oct3', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Oct 4 ({oct4.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct4 * 100} onChange={(e) => this.updateInput('oct4', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Oct 5 ({oct5.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct5 * 100} onChange={(e) => this.updateInput('oct5', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Oct 6 ({oct6.toFixed(2)}):</label>
                            <input type='range' min='0' max='100' value={oct6 * 100} onChange={(e) => this.updateInput('oct6', e.target.value / 100)}></input>
                        </div>
                        <div>
                            <label>Power ({pow.toFixed(2)}):</label>
                            <input type='range' min='1' max='1000' value={pow * 100} onChange={(e) => this.updateInput('pow', e.target.value / 100)}></input>
                        </div>
                    </div>
                    <div id='calc-container'>
                        <p id='calc-desc'>Use these buttons to interact with the environment, click on the bird's eye view to place the currently selected marker.</p>
                        <div id='calc-options-container'>
                            <button id='start-point-btn' className={`marker-btn${this.state.markerSelect === 'start' ? ` current-marker` : ``}`} onClick={() => this.toggleInput('markerSelect', 'start')}>Start</button>
                            <button id='end-point-btn' className={`marker-btn${this.state.markerSelect === 'end' ? ` current-marker` : ``}`} onClick={() => this.toggleInput('markerSelect', 'end')}>End</button>
                            <button id='clear-point-btn' className='marker-btn' onClick={() => this.clearMarkers()}>Clear</button>
                            <hr />
                            <button id='fire-btn' className={`marker-btn`} disabled={this.canFire()} onClick={() => this.fireMortar(this.state.start, this.state.end)}>Fire</button>
                        </div>
                    </div>
                </div>
                <div id='sim-btn-container'>
                    <div id='direction-btn-container'>
                        <button id='north' className={`dir-btn${this.state.horizonDirection === `north` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'north')}>N</button>
                        <button id='east' className={`dir-btn${this.state.horizonDirection === `east` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'east')}>E</button>
                        <button id='south' className={`dir-btn${this.state.horizonDirection === `south` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'south')}>S</button>
                        <button id='west' className={`dir-btn${this.state.horizonDirection === `west` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'west')}>W</button>
                        {this.renderArrow()}
                    </div>
                    <button id='alpha-btn' className={`sim-btn${this.state.horizonAlpha ? ` highlight` : ``}`} onClick={() => this.toggleInput('horizonAlpha')}>Horizon Alpha</button>
                    <button id='topo-btn' className={`sim-btn${this.state.showNoise ? ` highlight` : ``}`} onClick={() => this.toggleInput('showNoise')}>Bird's Eye Noise</button>
                    <button id='regen-btn' className='sim-btn' onClick={this.updateSeed}>Regenerate</button>
                </div>
                <div id='sim-container'>
                    <Horizon grid={this.state.grid} scale={400 / SIZE} alpha={this.state.horizonAlpha} direction={this.state.horizonDirection} start={this.state.start} end={this.state.end} blam={this.state.blam} />
                    <Bird grid={this.state.grid} scale={400 / SIZE} showNoise={this.state.showNoise} start={this.state.start} end={this.state.end} blam={this.state.blam} selectPosition={this.selectPosition} marker={this.state.markerSelect} />
                </div>
            </>
        );
    }
}

export default Sim;


/* Calc Notes
        Shell Math
1 grid node === ? meters

1 ton === 907.185kg
Mortar has 24 shots per ton, assume ammo bin weighs the last two kg of each shell.
907.185kg / 24 shots = 37.8kg -> assume 35kg per shot, which is HUGE compared to real life mortars, but this is a shell for a 'mech
Max range according to RT is 690m, and we're assuming that the shell just collides with the target, nothing fancy like airbursts

    - angle would be 45° for max range
    - ignoring air resistance
    - assuming every planet has earth's gravity for simplicity

    Launch a 35kg shell 690m at 45°

    m = 35kg;
    v = necessary velocity;
    t = time;
    ø = 45°;

    cos(ø)vt = 690m;
    sin(ø)vt - 1/2 * 9.8m/s²t² = 0m;

    vt = 690m/cos(ø);

    2sin(ø)690m/cos(ø) = 9.8m/s²t²;
    √(2sin(ø)690s²/(cos(ø)9.8)) = t;
    t = ~11.86s;

    v = 690m/(cos(ø)11.86s);
    v = ~82.28m/s;
    horizontal v = v * cos(ø) = ~58.18m/s;
    vertical v = v * sin(ø) = ~58.18m/s;

    Kinetic Energy (K) = 0.5mv²

    K = 0.5(35kg)(82.28m/s)² = ~118474.97J

    Kinetic Energy at the end of its flight if the target is the ground:
    vᵧ₂ = 82.28m/s * sin(ø) - 9.8m/s²*11.86s;
    vᵧ₂ = ~58.05m/s downward, which is close enough to the initial vertical v of 58.18m/s that we can say:
    Assuming the target is 0m in height compared to the start point, the shell hits the target with ~118474.97J
    Of course, if we factored in air resistance this would be different

    So the shell has to leave the barrel with about 118475 Joules in order to travel 690m;

    The maximum height it achieves in that time is at the point when the vertical velocity is 0m/s:
    0m/s = 82.28m/s * sin(ø) - 9.8m/s²*t₁;
    t₁ = 82.28m/s * sin(ø) / 9.8m/s²;
    t₁ = ~5.94s;

    82.28m/s * sin(ø) * 5.94s - 1/2 * 9.8m/s² * 5.94s² = h₁;
    h₁ = ~172.70m;

    The maximum height is only 172.70m, so at max range the shell can't actually clear much if we were being realistic.

    t₁ = v * sin(ø) / g
    h₁ = v * sin(ø) * t₁  - 1/2 * g * t₁² = (v * sin(ø))² / g - 1/2 * g * (v * sin(ø) / g)² = (v * sin(ø))² / g - (v * sin(ø))² / 2g;
    h₁ = (v * sin(ø))² / 2g;
    Max height at 90° = (82.28m/s * sin(90°)² / (2 * 9.8m/s²);
    Max height at 90° = ~345.41m

    So the shell can clear between 345.41m and 172.70m of vertical obstructions at the height of its arc depending on the shot angle
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Recap:
        -At 45°, with no air resistance and earth gravity
        -The shell can travel 690m
        -It leaves the barrel at ~82.28m/s, with a horizontal component of ~58.18m/s
        -It has 118474.97J of kinetic energy as it leaves the barrel and when it hits a target at the same elevation

        -The shell can be aimed anywhere between 0m and 690m by adjusting the vertical angle;
        -At 90°, the maximum height is 345.41m, while at 45° the maximum height is 172.70m;

        -We'll assume that 45° is the minimum firing angle, and 90° the maximum
        -In game mortars can direct fire, but we'll just pretend that it's always indirect, since
        to maintain the same range stats with direct fire they'd need to suddenly fire the shell with much more force;

We'll assume that each pixel is one meter, as that ends up being about 175% the size of our canvas for max horizontal range,
and it means that our max vertical range will fit nicely inside of our horizontal canvas most of the time;

        General Procedure Plan
Calculate angle, power, etc to target
Roll to-hit
Calculate error radius
Randomly select point on error circle
Adjust parameters to hit point
*/