import React, { useState } from "react";
import axios from "axios";
import { Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import { useHistory } from "react-router-dom";

import "./styles.css";

const LoginForm = () => {
	let history = useHistory();

	const [password, changePassword] = useState("");

	const handleLogin = () => {
		axios
			.post("http://localhost:3000/keychain/init", {
				body: {
					password,
				},
			})
			.then((response) =>
				response.status === 200
					? history.push({
							pathname: "/home",
							state: { password },
					  })
					: console.log(response)
			);
	};

	return (
		<div className="form-wrapper">
			<div className="title">{"Enter the main password"}</div>
			<input
				type="text"
				placeholder="Password"
				value={password}
				onChange={(e) => changePassword(e.target.value)}
			/>
			<Button size = "nm" theme ="primary" onClick={handleLogin} className = "submit">
				{"Submit"}
			</Button>
		</div>
	);
};

export default LoginForm;
