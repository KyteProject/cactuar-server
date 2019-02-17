const { google } = require('googleapis');

class Youtube {
	constructor() {
		this.scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
		this.youtube = google.youtube({
			version: 'v3',
			key: process.env.YOUTUBE,
		});
	}

	async search(searchString) {
		let res;

		try {
			res = await this.youtube.search.list({
				part: 'snippet',
				q: searchString,
				maxResults: 1,
				type: 'video',
				key: process.env.YOUTUBE,
			});
		} catch (err) {
			return err;
		}

		return res.data.items[0].id.videoId;
	}
}

module.exports = new Youtube();
