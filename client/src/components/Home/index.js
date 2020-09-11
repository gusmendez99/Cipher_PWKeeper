import React, { Fragment, useState, useEffect} from 'react';
import axios from 'axios';

import Row from '../Row';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import './styles.css';


const Home = () => {

    
    const [textEditor, changeTextEditor] = useState(''); //for text editor component
    const [domain, changeDomain] = useState(''); //for form component
    const [pass, changePass] = useState(''); //for form component
    const [myDomains, changeDomains] = useState([]);
    
    const handleAddDomain = () => {
        if(domain && pass) {
            axios
                .post("http://localhost:3000/keychain/set", {
                    name: domain,
                    value: pass,
                })
                .then(response => {
                    console.log("response,", response.data);
                })
                .catch(error => {
                    console.log(error);
                    alert("Sorry domain/password don't added");
                });
            
            const newState = [...myDomains, {domain, password:"PASSWORD"}];
            changeDomains(newState);
            changeDomain('');
            changePass('');
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
            axios
                .delete(`http://localhost:3000/keychain/remove/${myDomains[id].domain}`)
                .then(response => {
                    console.log("response,", response.data);
                    const newState = myDomains.filter((e,i) => i != id);
                    changeDomains(newState);
                })
                .catch(error => {
                    console.log(error);
                    alert("Sorry password was not deleted correctly");
                });
    }

    const viewPass = async(id) => {

        console.log("id", id);

        if(id !== undefined) {

            axios
                .get(`http://localhost:3000/keychain/get/${myDomains[id].domain}`)
                .then(response => {
                    console.log("response", response.data);
                    const newState = [...myDomains];
                    newState[id] = {domain: myDomains[id].domain, password: response.data.split(" ")[1]}
                    changeDomains(newState);
                })
                .catch(error => {
                    console.log(error);
                    alert("Sorry can't retrieve info");
                });
                
            
        }

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
                        {   myDomains.length > 0 ?
                            myDomains.map((d,i) => (
                                <Row key={i} id={i} data={d} deleteRow={deleteRow} viewPass={viewPass}/>
                            )) :
                            <tr>Please add domains</tr>
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