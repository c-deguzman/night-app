

module.exports = function(app){

	app.post('/yelp', function(request, response) {

		const Yelp = require('node-yelp-api-v3');

		const yelp = new Yelp({
		  consumer_key: process.env.YELP_KEY,
		  consumer_secret: process.env.YELP_SECRET
		});
		 
		yelp.searchBusiness(request.body)
		 .then(data => response.send(data))
		 .catch(err => err);
	});
}