import React, { Component } from 'react';

import Bird from './fields/Bird';

class App extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return (
            <>
                <Bird />
            </>
        );
    }
}

export default App;