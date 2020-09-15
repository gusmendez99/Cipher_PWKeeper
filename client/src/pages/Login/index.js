import React, { useState } from "react";
import axios from "axios";

import Header from "../../components/Header";
import { Button } from "shards-react";
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
		<div className="login-container">
			<Header />
			<div className="form-wrapper">
				<div className="title">{"Enter master password"}</div>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => changePassword(e.target.value)}
				/>
				<Button
					size="nm"
					theme="primary"
					onClick={handleLogin}
					className="submit"
				>
					{"Submit"}
				</Button>
			</div>
		</div>
	);
};

export default LoginForm;
