import React, {  useState, useEffect } from 'react';


const Row = ({ data, id, deleteRow, viewPass, clearPass}) => {

    const [pass, changePass] = useState(data.password);
    const [isVisible, changeIsVisible] = useState(false);

    useEffect(() => {
        changePass(data.password);
    }, [data.password])

    const handleView = () => {
        if(!isVisible){
            viewPass(id);
        }
        if(isVisible && pass !== 'PASSWORD'){ 
            clearPass(id)
        }
        changeIsVisible(!isVisible);

    }

    return (
        <tr>
            <td>{data.domain}</td>
            {
                <>
                    <td><input type={isVisible ? "text" : "password"} disabled={true} value={pass} ></input></td>
                    <td><button onClick={handleView}>{isVisible ? "Hide" : "View"}</button></td>
                    <td><button onClick={() => deleteRow(id)}>Delete</button></td>
                </> 

            }
        </tr>
    );

}

export default Row;