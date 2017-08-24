module.exports = function(app){
  
	const passport = require('passport');

	app.post('/login', function(request, response, next) {
		passport.authenticate('local', function(err, user, info) {
		    if (err) { 
		    	return next(err); 
		    }
		    if (!user) { 
		    	return response.send({message: info.message,
		    						  result: "error"}); 
		    }
		    request.logIn(user, function(err) {
		      if (err) { 
		      	return next(err); 
		      }
		      return response.send({result: "success"});
		    });
	  	})(request, response, next);
	});

 	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
		function(req, res) {
			// Successful authentication, redirect home.
			res.redirect('/home');
		}
	);
}
