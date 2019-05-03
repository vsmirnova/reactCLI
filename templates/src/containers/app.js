import React, {Component} from 'react';
import {MainRoute} from './routes';
import { BrowserRouter as Router} from "react-router-dom";

class App extends Component {

    render() {
        return (
            <Router>
                <MainRoute/>
            </Router>
        );
    }

}

export default App;
