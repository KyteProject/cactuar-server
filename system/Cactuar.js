const { Client, Collection } = require('discord.js');
const path = require('path');
const klaw = require('klaw');

class Cactuar extends Client {
	constructor(options) {
		super(options);

		this.config = require(`${process.cwd()}/config.js`);
		this.logger = require(`${process.cwd()}/functions/logger`);
		this.query = require(`${process.cwd()}/functions/query.js`);
		// this.mongo = require(`${process.cwd()}/functions/mongo.js`);
		this.ccxt = require('ccxt');
		this.commands = new Collection();
		this.aliases = new Collection();
		this.rateLimits = new Collection();

		this.ready = false;
		this.on('ready', this._ready.bind(this));
	}

	async login(token) {
		await this.init();
		return super.login(token);
	}

	_ready() {
		this.ready = true;
		this.emit('cactuarReady');
	}

	permlevel(message) {
		let permLevel = 0;

		const permOrder = this.config.permLevels.slice(0).sort((p, c) => (p.level < c.level ? 1 : -1));

		while (permOrder.length) {
			const currentLevel = permOrder.shift();
			if (message.guild && currentLevel.guildOnly) continue;
			if (currentLevel.check(message)) {
				permLevel = currentLevel.level;
				break;
			}
		}
		return permLevel;
	}

	loadCommand(commandPath, commandName) {
		try {
			const props = require(`${commandPath}${path.sep}${commandName}`);
			props.conf.location = commandPath;
			this.logger.log(`Loading Command: ${props.help.name}. ✔`);
			if (props.init) {
				props.init(this);
			}
			this.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				this.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (error) {
			return `Unable to load command ${commandName}: ${error}`;
		}
	}

	permCheck(message, perms) {
		if (message.channel.type !== 'text') return;
		return message.channel.permissionsFor(message.guild.me).missing(perms);
	}

	async unloadCommand(commandPath, commandName) {
		let command;
		if (this.commands.has(commandName)) {
			command = this.commands.get(commandName);
		} else if (this.aliases.has(commandName)) {
			command = this.commands.get(this.aliases.get(commandName));
		}
		if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

		if (command.shutdown) {
			await command.shutdown(this);
		}
		delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
		return false;
	}

	async init() {
		const commandList = [];
		klaw('./commands')
			.on('data', item => {
				const file = path.parse(item.path);
				if (!file.ext || file.ext !== '.js') return;
				const response = this.loadCommand(file.dir, `${file.name}${file.ext}`);
				commandList.push(file.name);
				if (response) this.logger.error(response);
			})
			.on('end', () => {
				this.logger.log(`Loaded a total of ${commandList.length} commands.`);
			})
			.on('error', error => this.logger.error(error));

		const eventList = [];
		klaw('./events')
			.on('data', item => {
				const eventFile = path.parse(item.path);
				if (!eventFile.ext || eventFile.ext !== '.js') return;
				const eventName = eventFile.name.split('.')[0];
				try {
					const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(this);
					eventList.push(event);
					this.on(eventName, (...args) => event.run(...args));
					this.logger.log(`Loading Event: ${eventName}. ✔`);
					delete require.cache[
						require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)
					];
				} catch (error) {
					this.logger.error(`Error loading event ${eventFile.name}: ${error}`);
				}
			})
			.on('end', () => {
				this.logger.log(`Loaded a total of ${eventList.length} events.`);
			})
			.on('error', error => this.logger.error(error));

		this.levelCache = {};
		for (let i = 0; i < this.config.permLevels.length; i += 1) {
			const thisLevel = this.config.permLevels[i];
			this.levelCache[thisLevel.name] = thisLevel.level;
		}
	}
}

module.exports = Cactuar;
