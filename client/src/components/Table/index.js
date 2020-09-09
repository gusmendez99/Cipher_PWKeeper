import React from 'react';

import Row from '../Row';

import './styles.css';

const Table = () => {

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
                <tr>
                    <Row domain="www.gmail.com"/>
                    {/* TODO: DELETE FROM LOCAL STATE ROW */}
                    <td><button>Delete</button></td>
                </tr>
                <tr>
                    <Row domain="www.youtube.com"/>
                    {/* TODO: DELETE FROM LOCAL STATE ROW */}
                    <td><button>Delete</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Table;