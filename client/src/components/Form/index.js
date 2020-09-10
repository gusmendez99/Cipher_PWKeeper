import React, { Fragment, useState } from 'react';

import './styles.css';

const Form = () => {

    const [domain, changeDomain] = useState('');
    const [pass, changePass] = useState('');

    const handleAddDomain = () => {
        alert(pass);
    }

    return (
        <Fragment>
        <div className="container">
           <div>
               <legend><h2>Add domain</h2></legend>
               <label>Domain</label><br/>
               <input 
                    type="text"
                    placeholder="Ej. www.google.com"
                    value={domain}
                    onChange={e => (changeDomain(e.target.value))}
                /><br/>
               <label>Password</label><br/>
               <input 
                    type="password" 
                    placeholder="Password"
                    value={pass}
                    onChange={e => (changePass(e.target.value))}
               /><br/>
               <button onClick={handleAddDomain}>Add</button>
           </div>
       </div> 
        </Fragment>
    );

}


export default Form;