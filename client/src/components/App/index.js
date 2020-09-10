import React from 'react';

import Home from '../Home';
import Login from '../Login';

const domains = [
    "www.google.com",
    "www.youtube.com",
    "www.hotmail.com",
]

const App = () => {

    return (
        <div>
            <Home domains={domains} />
        </div>
    );
}

export default App;