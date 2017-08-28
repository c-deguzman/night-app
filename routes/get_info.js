module.exports = {
  
  get_user(app){
    app.post('/get_user', function(request, response){
      if (!request.isAuthenticated()){
        response.send(false);
      } else {
        response.send(request.user.displayName);
      }
    });
  },

  get_id(app){
    app.post('/get_id', function(request, response){
      if (!request.isAuthenticated()){
        response.send(false);
      } else {
        response.send(request.user._id);
      }
    });
  },

  get_loc_goings(app){
    app.post('/get_loc_goings', function(request, response){

      var MongoClient = require('mongodb').MongoClient;

      if (!request.isAuthenticated()){
        response.send([]);
      } else {
        MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            throw err;
            return;
          }

          db.collection("goings", function (err, collection){

            if (err){
              throw err;
              return;
            } 

            collection.find({loc: request.body.loc}).toArray(function (err, docs) {
              if (err){
                throw err;
                return;
              } 

              response.send(docs.length);
            });
          });
        });
      }
    });
  },

  get_my_goings(app){
    app.post('/get_my_goings', function(request, response){

      var MongoClient = require('mongodb').MongoClient;

      var days = Math.round(new Date().getTime() / 86400000);

      if (!request.isAuthenticated()){
        response.send([]);
      } else {
        MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
          if (err){
            throw err;
            return;
          }

          db.collection("goings", function (err, collection){

            if (err){
              throw err;
              return;
            } 

            collection.find({user: request.user._id, time: {$eq: days}}).toArray(function (err, docs) {
              if (err){
                throw err;
                return;
              } 

              var return_array = [];

              for (var i in docs){
                return_array.push(docs[i].loc);
              }

              response.send(return_array);
            });
          });
        });
      }
    });
  },

  get_loc_goings(app){
    app.post('/get_loc_goings', function(request, response){

      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("goings", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.find({loc: request.body.loc}).toArray(function (err, docs) {
            if (err){
              throw err;
              return;
            } 

            response.send({len: docs.length});
          });
        });
      });
      
    });
  },

  get_user_disp(app){
    app.post('/get_user_disp', function(request, response){

      var MongoClient = require('mongodb').MongoClient;
      var ObjectId = require('mongodb').ObjectId; 
      var obj_id = new ObjectId(request.body.id);

      var MongoClient = require('mongodb').MongoClient;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("accounts", function (err, collection){

          if (err){
            throw err;
            return;
          } 

          collection.findOne({_id: obj_id}, function (err, doc) {
            if (err){
              throw err;
              return;
            } else if (doc){
              response.send(doc.displayName);
            } else {
              response.send(false);
            }
          });
        });
      });
    });
  },


  set_disp(app){
    app.post("/set_disp", function(request, response){
      var MongoClient = require('mongodb').MongoClient;

      var displayName = request.body.displayName;

      MongoClient.connect(process.env.MONGO_CONNECT, function (err, db){
        if (err){
          throw err;
          return;
        }

        db.collection("accounts", function (err, collection){

          if (err){
            response.send({
              result: "error",
              error: "Database connection failed."
            });
            return;
          }

          collection.updateOne({user: request.user.user, twitterID: request.user.twitterID, pass: request.user.pass}, {$set: {displayName: displayName, firstTime: false}}, function(err, result){
            if (err){
              response.send({
                result: "error",
                error: "User information update failed."
              });
              return;
            }

            collection.findOne({user: request.user.user, twitterID: request.user.twitterID, pass: request.user.pass}, function(err, doc){
              if (err){
                response.send({
                  result: "error",
                  error: "User information update failed."
                });
                return;
              }

              request.login(doc, function(err) {
                if (err){
                  response.send({
                    result: "error",
                    error: "Relogging failed."
                  });
                  return;
                }

                response.send({
                  result: "success",
                  error: ""
                });
              });
            });
          });  
        });
      });
    });
  }
}