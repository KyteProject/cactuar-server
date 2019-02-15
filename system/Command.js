import { Permissions } from 'discords.js';

class Command {
	constructor(client, file, args = {}) {
		this.client = client;
		this.file = file;
		this.name = args.name;
		this.aliases = args.aliases || [];
		this.description = args.description || 'No description available.';
		this.category = args.category || '';
		this.extended = args.extended || 'No further information.';
		this.usage = args.usage || 'No usage info';
		this.cooldown = args.cooldown || 0;
		this.guildOnly = args.guildOnly || false;
		this.permLevel = args.permLevel || 'User';
		this.botPerms = args.botPerms || [];
		this.enabled = args.enabled || true;
	}

	async run(message, args, level) {
		throw new Error(`Command ${this.constructor.name} doesn't provide a run method.`);
	}
}
export default Command();
