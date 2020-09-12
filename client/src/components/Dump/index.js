import React from 'react';

import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const Dump = ({ fetchDump, data }) => {


    return (
        <div>
            <h2>Bulk domains</h2>
            <AceEditor
                mode="json"
                theme="monokai"
                value={data}
                name="textEditor"
                editorProps={{ $blockScrolling: true }}
            />
            <button onClick={fetchDump}>Upload</button>
        </div>
    )
}

export default Dump;