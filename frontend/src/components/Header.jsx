import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Header = () => {
	return (
		<section className="bg-home bg-gradient" id="home">
			<Container fluid>
				<Row className="justify-content-center">
					<Col lg="12" className="mx-auto text-center">
						<div className="header-text">
							<img src="cac-logo.png" height="200" alt="logo" />
							<h1 className="text-white mt-3">Enhance Your Community</h1>
							<h3 className="text-white">
								Cactuar is a Discord bot built to assist music production communities on discord. Use
								the button below to invite it to your server!
							</h3>
							<Button size="lg" className="mr-4 ml-4 btn-discord" tag={Link} to="#">
								<FontAwesomeIcon icon={faDiscord} size="2x" />{' '}
								<span className="btn-text">Add to Discord</span>
							</Button>
							<Button size="lg" color="secondary" className="mr-4 ml-4" tag={Link} to="#">
								<FontAwesomeIcon icon={faGithub} size="2x" />{' '}
								<span className="btn-text">Star on Github</span>
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Header;
