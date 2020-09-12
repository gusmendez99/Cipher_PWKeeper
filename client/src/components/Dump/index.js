import React, {useState, useEffect} from 'react';

import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const Dump = ({ fetchDump,  representation, trustedDataCheck }) => {

    const [representationText, changeRepresentationText] = useState(representation);
    const [trustedDataCheckText, changeTrustedDataCheckText] = useState(trustedDataCheck);

    useEffect(()=> {
        console.log('Dump was done...')
        changeRepresentationText(representation);
        changeTrustedDataCheckText(trustedDataCheck)
    },[representation, trustedDataCheck])

    return (
        <div>
            <h2>Dump & Load</h2>
            <h4>Representation (string)</h4>
            <AceEditor
                height="150px"
                mode="json"
                theme="monokai"
                value={representationText}
                onChange={text => changeRepresentationText(text)}
                name="textEditor"
            />
            <h4>Trusted Data Check (array)</h4>
            <AceEditor
                height="150px"
                mode="json"
                theme="monokai"
                value={trustedDataCheckText}
                onChange={text => changeTrustedDataCheckText(text)}
                name="textEditor"
            />
            <button onClick={() => fetchDump()}>Dump database</button>
            <button onClick={() => /* not implemented yet */ console.log('Loading...')}>Load database</button>
        </div>
    )
}

export default Dump;