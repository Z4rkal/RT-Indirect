import React, { Component } from 'react';

import Sim from './controllers/Sim';
import Canvas from './fields/Canvas';
//import CurveTest from './fields/CurveTest';

class App extends Component {
    constructor() {
        super();

        this.state = {
            startPoint: ['10', '80'],
            controlPoint: ['95', '180'],
            endPoint: ['180', '80']
        }
    }

    updateInput(field, value) {
        switch (field) {
            case 'startPoint':
            case 'controlPoint':
            case 'endPoint':
                value[0] = value[0].replace(/-/g, '');
                value[1] = value[1].replace(/-/g, '');
                value = value.join('-');
                value = value.replace(/[^0-9\-]+/g, '');
                value = value.split('-');
                break;
        }

        this.setState({
            [field]: value
        });
    }

    handleUpDown(event, field) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            let value;
            let increment = 0;
            if (event.key === 'ArrowUp') {
                increment = 1;
            }
            else if (event.key === 'ArrowDown') {
                increment = -1;
            }

            if (event.shiftKey)
                increment *= 5;
            if (event.metaKey || event.ctrlKey)
                increment *= 10;

            switch (field) {
                case 's1':
                    value = parseInt(this.state.startPoint[0]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [`${value}`, this.state.startPoint[1]];
                    this.updateInput('startPoint', value);
                    break;
                case 's2':
                    value = parseInt(this.state.startPoint[1]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [this.state.startPoint[0], `${value}`];
                    this.updateInput('startPoint', value);
                    break;
                case 'c1':
                    value = parseInt(this.state.controlPoint[0]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [`${value}`, this.state.controlPoint[1]];
                    this.updateInput('controlPoint', value);
                    break;
                case 'c2':
                    value = parseInt(this.state.controlPoint[1]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [this.state.controlPoint[0], `${value}`];
                    this.updateInput('controlPoint', value);
                    break;
                case 'e1':
                    value = parseInt(this.state.endPoint[0]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [`${value}`, this.state.endPoint[1]];
                    this.updateInput('endPoint', value);
                    break;
                case 'e2':
                    value = parseInt(this.state.endPoint[1]);
                    value = Math.min(Math.max(value + increment, 0), 2000);
                    value = [this.state.endPoint[0], `${value}`];
                    this.updateInput('endPoint', value);
                    break;
                default: throw new Error(`Invalid field (${field}) in handleUpDown`);
            }
        }
    }

    render() {
        const { startPoint, controlPoint, endPoint } = this.state;
        return (
            <>
                <h1 className='title'>Indirect Fire Simulator</h1>
                <Sim startPoint={startPoint} controlPoint={controlPoint} endPoint={endPoint} />
                <hr id='app-break'/>
                <Canvas />
            </>
        );
    }
}

export default App;

/*
    <hr id='curve-break'/>
    <div id='curve-container'>
        <div id='curve-input-container'>
            <label>Start Point</label>
            <div className='input-group'>
                <label>X:</label>
                <input type='text' value={startPoint[0]} onChange={(e) => this.updateInput('startPoint', [e.target.value, startPoint[1]])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 's1'); }}></input>
                <label>Y:</label>
                <input type='text' value={startPoint[1]} onChange={(e) => this.updateInput('startPoint', [startPoint[0], e.target.value])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 's2'); }}></input>
            </div>
            <label>Control Point</label>
            <div className='input-group'>
                <label>X:</label>
                <input type='text' value={controlPoint[0]} onChange={(e) => this.updateInput('controlPoint', [e.target.value, controlPoint[1]])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 'c1'); }}></input>
                <label>Y:</label>
                <input type='text' value={controlPoint[1]} onChange={(e) => this.updateInput('controlPoint', [controlPoint[0], e.target.value])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 'c2'); }}></input>
            </div>
            <label>End Point</label>
            <div className='input-group'>
                <label>X:</label>
                <input type='text' value={endPoint[0]} onChange={(e) => this.updateInput('endPoint', [e.target.value, endPoint[1]])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 'e1'); }}></input>
                <label>Y:</label>
                <input type='text' value={endPoint[1]} onChange={(e) => this.updateInput('endPoint', [endPoint[0], e.target.value])} onKeyDown={(e) => { e.persist(); this.handleUpDown(e, 'e2'); }}></input>
            </div>
        </div>
        <CurveTest startPoint={startPoint} controlPoint={controlPoint} endPoint={endPoint} />
    </div>
*/