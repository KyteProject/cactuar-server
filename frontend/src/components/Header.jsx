import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Header = () => {
	return (
		<section className="bg-home bg-gradient" id="home">
			<Container fluid>
				<Row>
					<Col className="text-center">
						<img src="cac-logo.png" height="200" alt="logo" />
						<h1 className="text-white mt-3">Enhance Your Community</h1>
						<h3 className="text-white">
							Cactuar is a Discord bot built to assist music production communities on discord. Use the
							button below to invite it to your server!
						</h3>
						<h4>
							<span className="badge badge-success mt-3">Invite to Discord</span>
						</h4>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Header;
