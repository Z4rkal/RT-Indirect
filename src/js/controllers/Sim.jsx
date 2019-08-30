import React, { Component } from 'react';

import Bird from '../fields/Bird';
import Horizon from '../fields/Horizon';

import buildGrid from '../lib/buildGrid';

const SIZE = 40;

class Sim extends Component {
    constructor() {
        super();

        this.state = {
            grid: []
        }

        this.updateGrid = this.updateGrid.bind(this);
    }

    componentDidMount() {
        let grid = buildGrid(SIZE);

        this.setState({
            grid: grid
        });
    }

    updateGrid() {
        let grid = buildGrid(SIZE);

        this.setState({
            grid: grid
        });
    }

    render() {
        return (
            <>
                <button id='regen-btn' onClick={this.updateGrid}>Regenerate</button>
                <div id='sim-container'>
                    <Horizon grid={this.state.grid} />
                    <Bird grid={this.state.grid} />
                </div>
            </>
        );
    }
}

export default Sim;