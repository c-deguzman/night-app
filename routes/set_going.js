module.exports = function(app){
	
	app.post('/set_going', function(request, response) {

		if (request.isAuthenticated() == false){
			response.send({
				result: "error",
				error: "You must be signed in to mark going"
			});
			
			return;
		}

		var MongoClient = require('mongodb').MongoClient;

	    var raw_id = request.body.id;

		var days = Math.round(new Date().getTime() / 86400000);

		 MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            response.send({"result": "error",
        			       "error": "Internal connection ERROR. Please report this to site admin."});
            return;
          }

	    	db.collection("goings", function (err, collection){
	    		if (err){
		            response.send({"result": "error",
		        			       "error": "Internal connection ERROR. Please report this to site admin."});
		            return;
		          }

		        collection.findOne({loc: raw_id, user: request.user._id, time: {$eq: days}}, function (err, doc){
	            	if (err){
			            response.send({"result": "error",
			        			       "error": "Internal connection ERROR. Error retrieving site information."});
			        	return;
			        }

			        if (doc){
			        	response.send({
				        	"result": "error",
				        	"error": "User has already marked going."
				        });
			        } else {

			        	collection.insertOne({loc: raw_id, user: request.user._id, time: days}, function (err, doc){
			        		if (err){
					            response.send({"result": "error",
					        			       "error": "Internal connection ERROR. Error retrieving site information."});
					        	return;
					        }

					        response.send({
					        	result: "success",
					        	error: ""
					        })
			        	});
			        }
		      	});
	    	});
  		});
	});
}