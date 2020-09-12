import React from 'react';

import Row from '../Row';

import './styles.css';

const Table = ({ myDomains, deleteRow, viewPass, clearPass }) => {

    return (
        <div className="container">
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
                        <Row key={i} id={i} data={d} deleteRow={deleteRow} viewPass={viewPass} clearPass={clearPass}/>
                    )) :
                    <tr><td>Please add domains</td></tr>
                }
            </tbody>
        </table>
        </div>
    );
}

export default Table;