import React from 'react';

import Navigation from '../components/Navigation';
import Header from '../components/Header';
import About from '../components/About';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
	return (
		<>
			<Navigation />
			<Header />
			<About />
			<FAQ />
			<Contact />
			<Footer />
		</>
	);
};

export default Home;
