import React, { Fragment, useState } from 'react';


const Row = ({ domain }) => {

    const [pass, changePass] = useState('password');
    const [isVisible, changeIsVisible] = useState(false);
    const [isLoading, changeLoading] = useState(false);

    const handleView = () => {
        changeIsVisible(!isVisible);
    }

    return (
        <Fragment>
            <td>{domain}</td>
            {
                !isLoading 
                ? 
                <div>
                    <td><input type={isVisible ? "text" : "password"} disabled={true} value={pass} ></input></td>
                    <td><button onClick={handleView}>View</button></td>
                </div> 
                :
                <td>Loading ... </td>
            }
        </Fragment>
    );

}

export default Row;