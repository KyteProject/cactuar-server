class DailyChallenge {
	constructor(client, args = {}) {
		this.client = client;
		this.name = args.name;
		this.length = args.length || 30;
		this.description = args.description || 'No description available.';
		this.reward = args.reward || 100;
		this.guildOnly = args.guildOnly || true;
		this.enabled = args.enabled || true;
	}

	//Create event

	update() {}

	pause() {}

	end() {}
}
export default DailyChallenge();
