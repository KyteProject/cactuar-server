exports.run = async (client, message, args, level) => {
	const fetchPrice = async (exchange, symbol) => {
		const price = await exchange.fetchTicker(symbol);
		message.channel.send(`Last price for ${symbol}: **${price.last}** (*${exchange.name}*)`);
	};

	if (!args[0]) {
		const exchange = new client.ccxt.bitfinex();
		const symbol = 'BTC/USD';
		fetchPrice(exchange, symbol);
	} else if (client.ccxt.exchanges.includes(args[0])) {
		const exchange = new client.ccxt[args[0]]();
		if (args[1]) {
			const symbols = await exchange.fetchMarkets();
			const symbol = args[1].toUpperCase();
			if (symbols.find(k => k.symbol === symbol)) {
				fetchPrice(exchange, symbol);
			} else {
				message.channel.send('Invalid currency pair.');
			}
		} else {
			message.channel.send('You need to supply a currency pair supported by the exchange. (eg. BTC/USD)');
		}
	} else {
		message.channel.send('Invalid exchange.');
	}
};

exports.conf = {
	enabled: false,
	guildOnly: false,
	cooldown: 10,
	aliases: ['cc', 'cryptocurrency', 'btc'],
	permLevel: 'User',
	botPerms: [],
};

exports.help = {
	name: 'crypto',
	category: 'Miscelaneous',
	description: 'Display last price for a currency pair.',
	extended:
		'This command will allow you to query a cryptocurrency exchange and pull the last trade price for the currency pair as provided by the exchanges API.  If executed without arguments it will deafult to BTC/USD on the Bitfinex exchange.',
	usage: 'crypto [exchange] [currency pair] - Example: .crypto gdax btc/gbp',
};
