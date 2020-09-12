import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Home from '../Home';
import Login from '../Login';


const App = () => {

    return (
       <Router>
           <Switch>
                <Route exact path="/"><Login /></Route>
                <Route path="/home" ><Home/></Route>
           </Switch>
       </Router> 

    );
}

export default App;