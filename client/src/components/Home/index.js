import React, { Fragment, useState, useEffect} from 'react';
import axios from 'axios';

import Row from '../Row';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import './styles.css';
import { identity } from 'lodash';
import { response } from 'express';

const Home = ({ domains }) => {

    
    const [textEditor, changeTextEditor] = useState(''); //for text editor component
    const [domain, changeDomain] = useState(''); //for form component
    const [pass, changePass] = useState(''); //for form component
    const [myDomains, changeDomains] = useState(domains);
    
    useEffect(() => {
        changeDomains(domains)
    },
    [domains]);

    const handleAddDomain = () => {
        if(domain && pass) {
        //     axios
        //         .get("http://localhost:3000/keychain/set")
        //         .then(response => {
        //             console.log("response,", response.data);
        //         });
        alert(pass);
        }
        else {
            alert("Fill all fields please!");
        }
    }

    const handleBulkDomains = () => {
        if(textEditor){

            alert(textEditor);
        }
        else {
            alert("There is no text");
        }
    }

    const deleteRow = (id) => {
        const newState = myDomains.filter((e,i) => i != id);
        changeDomains(newState);
    }

    return (
        <Fragment>
            <div className="header">
                <h1>PWKeeper</h1>
            </div>
            <div className="container">

                <div className="table">
                <table>
                    <caption><h2>My domains</h2></caption>
                    <thead>
                        <tr>
                            <th>Domain</th>   
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myDomains.map((d,i) => (
                                <Row key={i} id={i} domain={d} deleteRow={deleteRow}/>
                            )) 
                        }
                    </tbody>
                </table>
                </div>


                <div className="form">
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


                <div>  
                    <h2>Bulk domains</h2>
                    <AceEditor 
                            mode="json"
                            theme="monokai"
                            value={textEditor}
                            onChange={newValue => changeTextEditor(newValue)}
                            name="textEditor"
                            editorProps={{ $blockScrolling: true }}
                    />
                    <button onClick={handleBulkDomains}>Upload</button>
                </div> 
            </div>
        </Fragment>
    );
}

export default Home;