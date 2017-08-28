module.exports = function(app){

	require('babel-core/register');

	var React = require('react');
	var ReactDOM = require('react-dom/server');

	app.get('/', function (request, response){
		response.redirect("/home");
	});


	app.get('/logout', function (request, response){
	  request.session.destroy(function (err) {
	    response.redirect('/login/');
	  });
	});


	app.get('/login', function(request, response) {
	  //response.sendFile(path.join(__dirname, '/views/login_index.html'));
	  var Login_App = require(process.env.ROOT + "/src/Login.js").default;
	  var Login_html = require(process.env.ROOT + "/src/login_template").default;
	  
	  var Comp_Fact = React.createFactory(Login_App);
	  const Login_string = ReactDOM.renderToString(Comp_Fact());
	  
	  response.send(Login_html({
	    body: Login_string,
	    title: "Login"
	  }));
	});

	app.get('/register', function(request, response) {
	  var Register_App = require(process.env.ROOT + "/src/Register.js").default;
	  var Register_html = require(process.env.ROOT + "/src/register_template").default;
	  
	  var Comp_Fact = React.createFactory(Register_App);
	  const Register_string = ReactDOM.renderToString(Comp_Fact());
	  
	  response.send(Register_html({
	    body: Register_string,
	    title: "User Registration"
	  }));
	});

	app.get('/home', function(request, response) {
	  var Home_App = require(process.env.ROOT + "/src/Home.js").default;
	  var Home_html = require(process.env.ROOT + "/src/home_template").default;

	  var Comp_Fact = React.createFactory(Home_App);
	  const Home_string = ReactDOM.renderToString(Comp_Fact());
	  
	  response.send(Home_html({
	    body: Home_string,
	    title: "Home Page"
	  }));
	});


	app.get('/first', function(request, response) {
		if (request.isAuthenticated()){
	  		var App = require(process.env.ROOT + "/src/FirstNotice.js").default;
		  	var Html = require(process.env.ROOT + "/src/firstNotice_template").default;

		  	var Comp_Fact = React.createFactory(App);
		  	const React_string = ReactDOM.renderToString(Comp_Fact());
		  
		  	response.send(Html({
		    	body: React_string,
		    	title: "First Login"
		  	}));
	  	} else {
			response.redirect("/home");
		}
	});


	app.get('/profile', function(request, response) {

		if (request.isAuthenticated()){
			var App = require(process.env.ROOT + "/src/Profile.js").default;
			var Html = require(process.env.ROOT + "/src/profile_template").default;

			var Comp_Fact = React.createFactory(App);
			const React_string = ReactDOM.renderToString(Comp_Fact());

			response.send(Html({
				body: React_string,
				title: "Edit Profile"
			}));
		} else {
			response.redirect("/home");
		}
	});
}