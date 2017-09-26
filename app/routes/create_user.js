 module.exports = function(app, db, User) {


     app.get('/setup', function(req, res) {

         // create a sample user
         var nick = new User({
             name: 'admin',
             password: 'password',
             admin: true
         });

         // save the sample user
         nick.save(function(err) {
             if (err) throw err;

             console.log('User saved successfully');
             res.json({ success: true });
         });
     });



 }; // end export