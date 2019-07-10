import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Navigation = () => {
	const [ navOpen, setNavOpen ] = useState( false ),
		toggle = () => setNavOpen( !navOpen );

	return (
		<Navbar expand="md" light className="navbar-custom bg-dark">
			<NavbarBrand href="/">
				<img src="cactuar-logo.png" height="70px" />
			</NavbarBrand>
			<NavbarToggler onClick={toggle} />
			<Collapse navbar isOpen={navOpen}>
				<Nav className="mr-auto flex-lg-row">
					<NavItem>
						<NavLink href="/">Home</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/changelog">Change-log</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/commands">Commands</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/contact">Contact</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="/help">Help</NavLink>
					</NavItem>
				</Nav>
			</Collapse>
		</Navbar>
	);
};

export default Navigation;
