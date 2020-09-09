import React, { Fragment, useState } from 'react';

import Table from '../Table';
import Form from '../Form';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import './styles.css';

// TODO: LA DIRECCION DE LAS PROPS DEBE SER EN UN SOLO SENTIDO POR LO QUE SE 
//     DEBEN QUITAR LOS COMPONENTES TABLE Y FORM Y COLOCARLOS COMO COMPONENTES
//     DE LA VISTA ESTO CON EL FIN DE MENEJAR SOLO UN ESTADO (SOLO EL ESTADO
//         DE LA VISTA HOME)

const Home = () => {

    const [textEditor, changeTextEditor] = useState('');


    const handleBulkDomains = () => {
        alert(textEditor);
    }

    return (
        <Fragment>
            <div className="header">
                <h1>PWKeeper</h1>
            </div>
            <div className="container">
                <Table />
                <Form />
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