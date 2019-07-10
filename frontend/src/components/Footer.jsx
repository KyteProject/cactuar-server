import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
	const date = new Date();

	return (
		<footer className="bg-dark footer">
			<Container fluid>
				<Row>
					<Col lg="12">
						<p className="text-white-50 text-center">© {date.getFullYear()}</p>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
