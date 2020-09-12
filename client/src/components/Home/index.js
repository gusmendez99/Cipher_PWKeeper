import React, { Fragment, useState } from 'react';
import axios from 'axios';

import Table from '../Table';
import Form from '../Form';

import './styles.css';
import Dump from '../Dump';


const Home = () => {

    const [text, changeText] = useState(''); //for text editor
    const [myDomains, changeDomains] = useState([]);

    const handleAddDomain = (domain, pass) => {
        if (domain && pass) {
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

            const newState = [...myDomains, { domain, password: "PASSWORD" }];
            changeDomains(newState);

        }
        else {
            alert("Fill all fields please!");
        }
    }

    const handleFetchDump = () => {
            //changeText() after response and JSON Stringify
    }

    const clearPass = (id) => {
        const newState = [...myDomains];
        newState[id] = {...myDomains[id], password: "PASSWORD"};
        changeDomains(newState);
    } 


    const deleteRow = (id) => {
        axios
            .delete(`http://localhost:3000/keychain/remove/${myDomains[id].domain}`)
            .then(response => {
                console.log("response,", response.data);
                const newState = myDomains.filter((e, i) => i !== id);
                changeDomains(newState);
            })
            .catch(error => {
                console.log(error);
                alert("Sorry password was not deleted correctly");
            });
    }

    const viewPass = (id) => {

        console.log("id", id);

        if (id !== undefined) {

            axios
                .get(`http://localhost:3000/keychain/get/${myDomains[id].domain}`)
                .then(response => {
                    console.log("response", response.data);
                    const newState = [...myDomains];
                    newState[id] = { domain: myDomains[id].domain, password: response.data.split(" ")[1] }
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

                <Table myDomains={myDomains} deleteRow={deleteRow} viewPass={viewPass} clearPass={clearPass}/>

                <Form handleAddDomain={handleAddDomain} />

                <Dump fetchDump={handleFetchDump} data={text}/>

            </div>
        </Fragment>
    );
}

export default Home;
