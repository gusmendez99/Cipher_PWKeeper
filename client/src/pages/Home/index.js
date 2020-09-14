import React, { Fragment, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "shards-react";
import Table from "../../components/Table";
import Form from "../../components/Form";
import Dump from "../../components/Dump";

import "./styles.css";

const EMPTY_PASSWORD = "";

const Home = () => {
	const location = useLocation();

	const [dumpData, changeDumpData] = useState(["", []]); //Dump API uri always return a two-item array
	const [myDomains, changeDomains] = useState([]);
	const [mainPassword, changeMainPassword] = useState("");

	useEffect(() => {
		changeMainPassword(
			location.state ? location.state.password : EMPTY_PASSWORD
		);
	}, [location]);

	const handleAddDomain = (domain, pass) => {
		if (domain && pass) {
			axios
				.post("http://localhost:3000/keychain/set", {
					name: domain,
					value: pass,
				})
				.then((response) => {
					console.log("response,", response.data);
				})
				.catch((error) => {
					console.log(error);
					alert("Sorry domain/password don't added");
				});

			const existDomain = myDomains.find((credential, i) => credential.domain === domain);
			if(!existDomain) {
				const newState = [...myDomains, { domain, password: "PASSWORD" }];
				changeDomains(newState);
			}
		} else {
			alert("Fill all fields please!");
		}
	};

	const handleFetchDump = () => {
		axios
			.get(`http://localhost:3000/keychain/dump/`)
			.then((response) => {
				console.log("response", response.data);
				changeDumpData(response.data);
			})
			.catch((error) => {
				console.log(error);
				alert("Sorry can't dump info");
			});
	};

	const handleLoadKeychain = (password, representation, trustedDataCheck) => {
		if (
			password &&
			representation &&
			trustedDataCheck &&
			trustedDataCheck.length > 0
		) {

            const trustedDataCheckAsBitArray = JSON.parse(trustedDataCheck)
            const data = { password, representation, trustedDataCheck: trustedDataCheckAsBitArray };
            console.log(data)
			axios
				.post(`http://localhost:3000/keychain/load/`, data)
				.then((response) => {
					console.log("response", response.data);
				})
				.catch((error) => {
					console.log(error);
					alert("Sorry can't dump info");
				});
		} else {
			alert("Load failed, please check if entered data is valid...");
		}
	};

	const clearPass = (id) => {
		const newState = [...myDomains];
		newState[id] = { ...myDomains[id], password: "PASSWORD" };
		changeDomains(newState);
	};

	const deleteRow = (id) => {
		axios
			.delete(
				`http://localhost:3000/keychain/remove/${myDomains[id].domain}`
			)
			.then((response) => {
				console.log("response,", response.data);
				const newState = myDomains.filter((e, i) => i !== id);
				changeDomains(newState);
			})
			.catch((error) => {
				console.log(error);
				alert("Sorry password was not deleted correctly");
			});
	};

	const viewPassword = (id) => {
		console.log("id", id);

		if (id !== undefined) {
			axios
				.get(
					`http://localhost:3000/keychain/get/${myDomains[id].domain}`
				)
				.then((response) => {
					console.log("response", response.data);
					const newState = [...myDomains];
					newState[id] = {
						domain: myDomains[id].domain,
						password: response.data.split(" ")[1],
					};
					changeDomains(newState);
				})
				.catch((error) => {
					console.log(error);
					alert("Sorry can't retrieve info");
				});
		}
	};

	return (
		
		<Fragment>
		<div className="Initial">
			<div className="header">
				<h1>PWKeeper</h1>
			</div>
			<div className="container">
				{mainPassword !== EMPTY_PASSWORD ? (
					<>
						<Table
							myDomains={myDomains}
							deleteRow={deleteRow}
							viewPassword={viewPassword}
							clearPass={clearPass}
						/>
						<Form handleAddDomain={handleAddDomain} />
						<Dump
							mainPassword={mainPassword}
							fetchDump={handleFetchDump}
							loadKeychain={handleLoadKeychain}
							representation={dumpData[0]}
							trustedDataCheck={JSON.stringify(dumpData[1])}
						/>
					</>
				) : (
					<Fragment>
						<h3>
							{"Main password does not exist, please go to "}
							<Link to="/">Home</Link>
						</h3>
					</Fragment>
				)}
			</div>
			</div>
		</Fragment>
		
	);
};

export default Home;
