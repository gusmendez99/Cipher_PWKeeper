import React, { useState } from "react";
import { Button } from "shards-react";
import "./styles.css";

const Form = ({ handleAddDomain }) => {
	const [domain, changeDomain] = useState("");
	const [pass, changePass] = useState("");

	const handleAdd = () => {
		handleAddDomain(domain, pass);
		changeDomain("");
		changePass("");
	};

	return (
		<div class="form">
			<div className="container">
				<div className="domain-form">
					<h2>Add domain</h2>
					<label>Domain</label>
					<input
						type="text"
						placeholder="Ej. www.google.com"
						value={domain}
						onChange={(e) => changeDomain(e.target.value)}
					/>
					<label>Password</label>
					<input
						type="password"
						placeholder="Password"
						value={pass}
						onChange={(e) => changePass(e.target.value)}
					/>
					<Button className="button" onClick={handleAdd}>Add</Button>
				</div>
			</div>
		</div>
	);
};

export default Form;
