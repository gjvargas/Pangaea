//To run tests:
//Run npm start in terminal while in the repo
//then, open QUnit.html, located in the views folder
//page opens, displaying which of the following tests passed or failed.
//Currently, the  create-exchange and logout tests fail.
//these two tests are failing due to bug in the tests, not in the underlying
//code that we seek to test.

// Lead Author: Jonathan



/////////////////////
//Create Good User//
///////////////////
QUnit.test("good user", function(assert) {

	var random_num = String(Math.random()).slice(2);
	
	var good_user_req = {
		username : random_num,
		email: random_num+"@mit.edu",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var good_user_res = "not yet defined";

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: good_user_req,
		dataType: "json"
	}).done(function(result){
		good_user_res = result;
	}).fail(function(err){
		good_user_res = err;
	});	

	assert.ok(good_user_req.username == random_num,"created user SUCCESS ");

});



// /////////////////////
// //duplicate email//
// ///////////////////
QUnit.test("duplicate email", function(assert) {

	var random_num = String(Math.random()).slice(2);
	
	var duplicate_email_req = {
		username : random_num,
		email: "repeat@mit.edu",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var duplicate_email_res = 0;

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: duplicate_email_req,
		dataType: "json"
	}).done(function(result){
		duplicate_email_res = 1;
	}).fail(function(err){
		duplicate_email_res = 0;
	});	

	assert.ok(duplicate_email_res == 0,"create user failed ");

});

// /////////////////////
// //duplicate username//
// ///////////////////
QUnit.test("duplicate username", function(assert) {

	var random_num = String(Math.random()).slice(2);
	
	var duplicate_username_req = {
		username : "repeat",
		email: "random_num@mit.edu",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var duplicate_username_res = 0;

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: duplicate_username_req,
		dataType: "json"
	}).done(function(result){
		duplicate_username_res = 1;
	}).fail(function(err){
		duplicate_username_res = 0;
	});	

	assert.ok(duplicate_username_res == 0,"create user failed ");

});



// /////////////////////
// //short password//
// ///////////////////
QUnit.test("short password", function(assert) {

	var random_num = String(Math.random()).slice(2);
	
	var short_password_req = {
		username : random_num,
		email: random_num+"@mit.edu",
		password: "short",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var short_password_res = 0;

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: short_password_req,
		dataType: "json"
	}).done(function(result){
		short_password_res = 1;
	}).fail(function(err){
		short_password_res = 0;
	});	

	assert.ok(short_password_res == 0,"create user failed ");

});



// /////////////////////
// //email format //
// ///////////////////
QUnit.test("email format", function(assert) {

	var random_num = String(Math.random()).slice(2);
	
	var email_format_req = {
		username : random_num,
		email: random_num+"@mit",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var email_format_res = 0;

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: email_format_req,
		dataType: "json"
	}).done(function(result){
		email_format_res = 1;
	}).fail(function(err){
		email_format_res = 0;
	});	

	assert.ok(email_format_res == 0,"create user failed ");

});


/////////////////////
//Create Exchange///
///////////////////
QUnit.test("create exchange", function(assert) {

	var random_num1 = String(Math.random()).slice(2);
	var random_num2 = String(Math.random()).slice(2);

	
	var user1_req = {
		username : random_num1,
		email: random_num1+"@mit.edu",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var user2_req = {
		username : random_num2,
		email: random_num2+"@mit.edu",
		password: "password1",
		proficiencies: ["Spanish"],
		desires: ["English"]
	}

	var create_exchange_res = "undefined";

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: user1_req,
		dataType: "json"
	}).done(function(result1){
		
			$.ajax({
			type: "POST",
			url: "/users/create",
			data: user2_req,
			dataType: "json"
		}).done(function(result2){
			
				console.log("result1", result1);
				console.log("result2ID", result2._id);

				var create_exchange_req = {
				user : result1,
				user_id : result2._id
				}

				$.ajax({
				type: "POST",
				url: "/exchanges/create/",
				data: create_exchange_req,
				dataType: "json"
			}).done(function(result3){
				
				create_exchange_res = true;
				
			}).fail(function(err){
				create_exchange_res = false;
				console.log("failure3");
				console.log(err);
			});	
			
		}).fail(function(err){
			create_exchange_res = false;
			console.log("failure2");
		});	

	}).fail(function(err){
		create_exchange_res = false;
		console.log("failure1");
	});	

	assert.ok(create_exchange_res == true,"created exchange SUCCESS ");

});

///////////////////////
////logout /////
/////////////////////
QUnit.test("logout", function(assert) {

	var random_num1 = String(Math.random()).slice(2);

	
	var user1_req = {
		username : random_num1,
		email: random_num1+"@mit.edu",
		password: "password1",
		proficiencies: ["English"],
		desires: ["Spanish"]
	}

	var logout_res = "undefined";

	$.ajax({
		type: "POST",
		url: "/users/create",
		data: user1_req,
		dataType: "json"
	}).done(function(result1){
					
				var logout_req = {
				user : result1
				}

				$.ajax({
				type: "POST",
				url: "/logout",
				data: logout_req,
				dataType: "json"
			}).done(function(result2){
				
				logout_res = true;
				
			}).fail(function(err){
				logout_res = false;
				console.log("failure3");
				console.log(err);
			});	
			
		

	}).fail(function(err){
		logout_res = false;
		console.log("failure1");
	});	

	assert.ok(logout_res == true,"logout SUCCESS ");

});

