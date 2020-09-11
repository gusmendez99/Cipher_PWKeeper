import React, {  useState, useEffect } from 'react';


const Row = ({ data, id, deleteRow, viewPass }) => {

    const [pass, changePass] = useState(data.password);
    const [isVisible, changeIsVisible] = useState(false);
    const [isLoading, changeLoading] = useState(false);

    const handleView = () => {
        changeIsVisible(!isVisible);
        if(!isVisible){
            viewPass(data.domain);
        }
    }

    return (
        <tr>
            <td>{data.domain}</td>
            {
                !isLoading 
                ? 
                <>
                    <td><input type={isVisible ? "text" : "password"} disabled={true} value={data.password} ></input></td>
                    <td><button onClick={handleView}>{isVisible ? "Hide" : "View"}</button></td>
                    <td><button onClick={() => deleteRow(id)}>Delete</button></td>
                </> 
                :
                <td>Loading ... </td>
            }
        </tr>
    );

}

export default Row;