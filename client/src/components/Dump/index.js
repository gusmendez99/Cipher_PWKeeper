import React, { useState, useEffect } from "react";
import { Button } from 'shards-react'

import AceEditor from "react-ace";
import './styles.css';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const Dump = ({
	fetchDump,
	mainPassword,
	loadKeychain,
	representation,
	trustedDataCheck,
}) => {
	const [representationText, changeRepresentationText] = useState(
		representation
	);
	const [trustedDataCheckText, changeTrustedDataCheckText] = useState(
		trustedDataCheck
	);

	useEffect(() => {
		console.log("Dump was done...");
		changeRepresentationText(representation);
		changeTrustedDataCheckText(trustedDataCheck);
	}, [representation, trustedDataCheck]);

	return (
		<div>
			<h2 className = 'white_title'>Dump & Load</h2>
			<h4 className = 'white_title'>Representation (string)</h4>
			<AceEditor
				height="150px"
				mode="json"
				theme="monokai"
				value={representationText}
				onChange={(text) => changeRepresentationText(text)}
				name="textEditor"
			/>
			<h4 className = 'white_title'>Trusted Data Check (array)</h4>
			<AceEditor
				height="150px"
				mode="json"
				theme="monokai"
				value={trustedDataCheckText}
				onChange={(text) => changeTrustedDataCheckText(text)}
				name="textEditor"
			/>
			<Button onClick={() => fetchDump()}>Dump database</Button>
			<Button
				onClick={() =>
					loadKeychain(
						mainPassword,
						representationText,
						trustedDataCheckText
					)
				}
			>
				Load database
			</Button>
		</div>
	);
};

export default Dump;
