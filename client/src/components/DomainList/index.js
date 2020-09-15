import React, { Fragment } from "react";

import Row from "../Row";

import "./styles.css";

const DomainList = ({ myDomains, deleteRow, viewPassword, clearPass }) => {
	return (
		<div>
			<h2 className="caption">My domains</h2>
			{myDomains.length > 0 ? (
				myDomains.map((data, index) => (
					<Row
						key={index}
						id={index}
						data={data}
						deleteRow={deleteRow}
						viewPassword={viewPassword}
						clearPass={clearPass}
					/>
				))
			) : (
				<Fragment>
					<img src="https://cdnmambet-a.akamaihd.net/booyah/build/pc/static/media/empty-clan.46f5ef7b.png" width="550" alt="holder" />
					<h5 className="caption">No credentials saved yet</h5>
				</Fragment>
			)}
		</div>
	);
};

export default DomainList;
