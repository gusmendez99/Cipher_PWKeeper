import React, { useState } from 'react';

import './styles.css';

const Form = ({ handleAddDomain }) => {

    const [domain, changeDomain] = useState('');
    const [pass, changePass] = useState('');

    const handleAdd = () => {
        handleAddDomain(domain, pass);
        changeDomain('');
        changePass('');
    }

    return (
        <div className="container">
            <div>
                <legend><h2>Add domain</h2></legend>
                <label>Domain</label><br />
                <input
                    type="text"
                    placeholder="Ej. www.google.com"
                    value={domain}
                    onChange={e => (changeDomain(e.target.value))}
                /><br />
                <label>Password</label><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={pass}
                    onChange={e => (changePass(e.target.value))}
                /><br />
                <button onClick={handleAdd}>Add</button>
            </div>
        </div>
    );

}


export default Form;