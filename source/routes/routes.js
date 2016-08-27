module.exports = function(app, passport) {

	console.log('Configuring app sign up')
	
	app.post('/signUp', passport.authenticate('local-signup', {
		successRedirect : '/skilltrackNetwork', // redirect to the secure profile section
		failureRedirect : '/showSubscribePage', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	app.post('/signIn', passport.authenticate('local-signin', {
		successRedirect : '/skilltrackNetwork', // redirect to the secure profile section
		failureRedirect : '/showLogInPage', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	
	app.get('/logout', function(req, res){
	    console.log('Received a logout request');
	    req.logout();
	    res.redirect('/');
	});
	
	
	
};

