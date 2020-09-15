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
		<div className="container">
			<h2 className = 'caption'>Dump & Load</h2>
			<h5 className = 'caption'>Representation (string)</h5>
			<AceEditor
				height="150px"
				mode="json"
				theme="monokai"
				value={representationText}
				onChange={(text) => changeRepresentationText(text)}
				name="textEditor"
			/>
			<h5 className = 'caption'>Trusted Data Check (array)</h5>
			<AceEditor
				height="150px"
				mode="json"
				theme="monokai"
				value={trustedDataCheckText}
				onChange={(text) => changeTrustedDataCheckText(text)}
				name="textEditor"
			/>
			<Button className="button" onClick={() => fetchDump()}>Dump database</Button>
			<Button
				className="button"
				theme="success"
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
