import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const About = () => {
	return (
		<section className="bg-light">
			<Container>
				<Row className="justify-content-center">
					<Col lg="12">
						<div className="about-title mx-auto text-center">
							<h2 className="font-weight-light">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
							</h2>
							<p className="text-muted pt-4">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim, possimus. Delectus ab
								itaque hic, tempore earum ad. Velit incidunt illum mollitia quasi a doloribus
								praesentium repellat itaque. Odio, laboriosam quod?
							</p>
						</div>
					</Col>
				</Row>
				<Row className="justify-content-center mt-5">{/*  */}</Row>
			</Container>
		</section>
	);
};

export default About;
