module.exports = function(app){
	var register = require("./register.js");
	var login = require('./login.js');

	var set_going = require("./set_going.js");
	var set_not_going = require("./set_not_going.js");

	var get_info = require("./get_info.js");

	var yelp = require("./yelp.js");
	
	login(app);
	register(app);

	set_going(app);
	set_not_going(app);

	yelp(app);

	get_info.get_user(app);
	get_info.get_id(app);
	get_info.get_user_disp(app);
	get_info.set_disp(app);

	get_info.get_loc_goings(app);
	get_info.get_my_goings(app);	

	var basic_routes = require('./basic_routes.js');

	basic_routes(app);

}