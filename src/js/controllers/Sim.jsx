import React, { Component } from 'react';
import SimplexNoise from 'simplex-noise';
import Alea from 'alea';

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
    }
    //TODO: pass noise parameters into buildGrid and have them be user input,
    //Keep the same seed until regen is hit
    //Move on to implementing the actual intent of the project
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
        });
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
                    <Horizon grid={this.state.grid} scale={400 / SIZE} alpha={this.state.horizonAlpha} direction={this.state.horizonDirection} start={this.state.start} end={this.state.end} />
                    <Bird grid={this.state.grid} scale={400 / SIZE} showNoise={this.state.showNoise} start={this.state.start} end={this.state.end} selectPosition={this.selectPosition} marker={this.state.markerSelect} />
                </div>
            </>
        );
    }
}

export default Sim;

//Calculate angle, power, etc to target
//Roll to-hit
//Calculate error radius
//Randomly select point on error circle
//Adjust parameters to hit point