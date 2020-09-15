import React, { useState, useEffect } from "react";
import { Button } from "shards-react";
import { Card, CardBody, CardTitle, CardSubtitle } from "shards-react";

import "./styles.css";

const Row = ({ data, id, deleteRow, viewPassword, clearPass }) => {
	const [pass, changePass] = useState(data.password);
	const [isVisible, changeIsVisible] = useState(false);

	useEffect(() => {
		changePass(data.password);
	}, [data.password]);

	const handleView = () => {
		if (!isVisible) {
			viewPassword(id);
		}
		if (isVisible && pass !== "PASSWORD") {
			clearPass(id);
		}
		changeIsVisible(!isVisible);
	};

	return (
		<Card>
			<CardBody>
				<CardTitle>{data.domain}</CardTitle>
				<br />
				<CardSubtitle>
					<input
						type={isVisible ? "text" : "password"}
						disabled={true}
						value={pass}
					/>
				</CardSubtitle>
				<div>
					<Button className="button" size="nm" theme="primary" onClick={handleView}>
						{isVisible ? "Hide" : "View"}
					</Button>

					<Button
						className="button"
						size="nm"
						theme="danger"
						theme="primary"
						onClick={() => deleteRow(id)}
					>
						Delete
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

export default Row;
