import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Home from '../Home';
import Login from '../Login';

const domains = [
    "www.google.com",
    "www.youtube.com",
    "www.hotmail.com",
]

const App = () => {

    return (
       <Router>7
           <Switch>
                <Route exact path="/"><Login /></Route>
                <Route path="/home" ><Home/></Route>
           </Switch>
       </Router> 

    );
}

export default App;