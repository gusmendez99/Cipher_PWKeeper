import React from "react";
import { Navbar, NavbarBrand } from "shards-react";

const Header = () => {
	return (
		<Navbar type="dark" theme="dark" expand="md">
			<NavbarBrand href="#">PW Keeper</NavbarBrand>
		</Navbar>
	);
};

export default Header;
