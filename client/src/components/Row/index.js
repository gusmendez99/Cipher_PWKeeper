import React, {  useState } from 'react';


const Row = ({ domain, id, deleteRow }) => {

    const [pass, changePass] = useState('password');
    const [isVisible, changeIsVisible] = useState(false);
    const [isLoading, changeLoading] = useState(false);

    const handleView = () => {
        changeIsVisible(!isVisible);
    }

    return (
        <tr>
            <td>{domain}</td>
            {
                !isLoading 
                ? 
                <>
                    <td><input type={isVisible ? "text" : "password"} disabled={true} value={pass} ></input></td>
                    <td><button onClick={handleView}>View</button></td>
                    <td><button onClick={() => deleteRow(id)}>Delete</button></td>
                </> 
                :
                <td>Loading ... </td>
            }
        </tr>
    );

}

export default Row;