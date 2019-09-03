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
            noiseSeed: undefined,
            simplex: undefined,
            oct: [0.80, 0.45, 0.14, 0.07, 0.03, 0.01],
            pow: 1.38
        }

        this.toggleInput = this.toggleInput.bind(this);
        this.updateSeed = this.updateSeed.bind(this);
        this.updateGrid = this.updateGrid.bind(this);
        this.renderArrow = this.renderArrow.bind(this);
    }
    //TODO: pass noise parameters into buildGrid and have them be user input,
    //Keep the same seed until regen is hit
    //Move on to implementing the actual intent of the project
    componentDidMount() {
        const random = new Alea()();
        const simplex = new SimplexNoise(random);

        const grid = buildGrid(SIZE, simplex, random, this.state.oct, this.state.pow);

        this.setState({
            noiseSeed: random,
            simplex: simplex,
            grid: grid
        });
    }

    componentDidUpdate(prevProps,prevState) {
        if(prevState.simplex !== this.state.simplex) {
            this.updateGrid();
        }
    }

    updateInput(field, value, index) {
        if (this.state[field] === undefined) throw new Error(`Invalid field passed into updateInput in Sim.jsx`);

        if (index !== undefined) {
            let array = this.state[field];

            array[index] = value;

            this.setState({
                [field]: array
            });
        }
        else {
            this.setState({
                [field]: value
            });
        }

        this.updateGrid();
    }

    toggleInput(field, value) {
        if (this.state[field] === undefined) throw new Error(`Invalid field passed into toggleInput in Sim.jsx`);

        if (field !== 'horizonDirection') {
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
        let grid = buildGrid(SIZE, this.state.simplex, this.state.noiseSeed, this.state.oct, this.state.pow);

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

    render() {
        const { oct, pow } = this.state;

        return (
            <>
                <div id='noise-options-container'>
                    <p id='noise-desc'>Noise Map Parameters:</p>
                    <label>e1 ({oct[0].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[0] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 0)}></input>
                    <label>e2 ({oct[1].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[1] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 1)}></input>
                    <label>e3 ({oct[2].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[2] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 2)}></input>
                    <label>e4 ({oct[3].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[3] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 3)}></input>
                    <label>e5 ({oct[4].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[4] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 4)}></input>
                    <label>e6 ({oct[5].toFixed(2)}):</label>
                    <input type='range' min='0' max='100' value={oct[5] * 100} onChange={(e) => this.updateInput('oct', e.target.value / 100, 5)}></input>
                    <label>power ({pow.toFixed(2)}):</label>
                    <input type='range' min='1' max='1000' value={pow * 100} onChange={(e) => this.updateInput('pow', e.target.value / 100)}></input>
                </div>
                <div id='sim-btn-container'>
                    <button id='alpha-btn' className='sim-btn' onClick={() => this.toggleInput('horizonAlpha')}>Horizon Alpha</button>
                    <button id='topo-btn' className='sim-btn' onClick={() => this.toggleInput('showNoise')}>Bird's Eye Noise</button>
                    <button id='regen-btn' className='sim-btn' onClick={this.updateSeed}>Regenerate</button>
                </div>
                <div id='direction-btn-container'>
                    <button id='north' className={`dir-btn${this.state.horizonDirection === `north` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'north')}>N</button>
                    <button id='east' className={`dir-btn${this.state.horizonDirection === `east` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'east')}>E</button>
                    <button id='south' className={`dir-btn${this.state.horizonDirection === `south` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'south')}>S</button>
                    <button id='west' className={`dir-btn${this.state.horizonDirection === `west` ? ` current-dir` : ``}`} onClick={() => this.toggleInput('horizonDirection', 'west')}>W</button>
                    {this.renderArrow()}
                </div>
                <div id='sim-container'>
                    <Horizon grid={this.state.grid} scale={400 / SIZE} alpha={this.state.horizonAlpha} direction={this.state.horizonDirection} />
                    <Bird grid={this.state.grid} scale={400 / SIZE} showNoise={this.state.showNoise} />
                </div>
            </>
        );
    }
}

export default Sim;
