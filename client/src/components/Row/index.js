import React, {  useState, useEffect } from 'react';
import { Button } from "shards-react";
import './styles.css';
const Row = ({ data, id, deleteRow, viewPassword, clearPass}) => {

    const [pass, changePass] = useState(data.password);
    const [isVisible, changeIsVisible] = useState(false);

    useEffect(() => {
        changePass(data.password);
    }, [data.password])

    const handleView = () => {
        if(!isVisible){
            viewPassword(id);
        }
        if(isVisible && pass !== 'PASSWORD'){ 
            clearPass(id)
        }
        changeIsVisible(!isVisible);

    }

    return (
        <div class="square1">
        <tr>
            <td>{data.domain}</td>
            {
                <>
                    <td><input type={isVisible ? "text" : "password"} disabled={true} value={pass} ></input></td>
                    <td><Button size = "nm" theme ="primary" onClick={handleView}>{isVisible ? "Hide" : "View"}</Button></td>
                   
                    <td><Button size = "nm" theme ="primary" onClick={() => deleteRow(id)}>Delete</Button></td>
                </> 

            }
        </tr>
        </div>
    );

}

export default Row;