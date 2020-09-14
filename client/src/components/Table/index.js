import React from 'react';

import Row from '../Row';

import './styles.css';

const Table = ({ myDomains, deleteRow, viewPassword, clearPass }) => {

    return (
        <div className="container">
        <caption><h2 className = 'caption'>My domains</h2></caption>
        <table>
            
            <thead>
            <p>
                <tr>
                    <th>Domain </th>  
                     <th>-</th>
                     <th>-</th>
                     <th>-</th>
                    <th> Password</th>
                </tr>
            </p>
            </thead>
            <tbody>
                {   myDomains.length > 0 ?
                    myDomains.map((d,i) => (
                        <Row key={i} id={i} data={d} deleteRow={deleteRow} viewPassword={viewPassword} clearPass={clearPass}/>
                    )) :
                    <tr><td>Please add domains</td></tr>
                }
            </tbody>
        </table>
        </div>
    );
}

export default Table;