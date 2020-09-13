import React, { useState } from "react";
import axios from "axios";

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
			<button className="submit" onClick={handleLogin}>
				{"Submit"}
			</button>
		</div>
	);
};

export default LoginForm;
