//To run tests:
//Run npm start in terminal while in the repo
//then, open QUnit.html, located in the views folder
//page opens, displaying which of the following tests passed or failed.
//Currently, the the create-exchange test fails due to a bug I was unable to fix 



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
			
				console.log(result1);
				console.log(result2._id);

				var create_exchange_req = {
				user : result1._id,
				user_id : result2._id
				}

				$.ajax({
				type: "POST",
				url: "/exchanges/create",
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



// ///////////////////
// //Edit User Test//
// /////////////////
// var edit_req = {
// 	proficiencies: ["English","Arabic"],
// 	desires: ["Spanish","Portuguese"]
// }

// var edit_res;

// $.ajax({
// 	type: "POST",
// 	url: "/users/edit",
// 	data: edit_req,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	edit_res = result;
// }).fail(function(err){
// 	console.log(err);
// 	edit_res = err;
// });

// ///////////////////
// //Get User Page///
// /////////////////
// var user_page_req = {
// 	user : good_user_res
// }

// var user_page_res;

// $.ajax({
// 	type: "GET",
// 	url: "/users/",
// 	data: user_page_req,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	user_page_res=result;
// }).fail(function(err){
// 	console.log(err);
// 	user_page_res=err;
// });


// /////////////////////
// //Get Translation///
// ///////////////////
// // var req4 = {
// // 	query : {
// // 		text : "hello",
// // 		language1 : "English",
// // 		language2 : "Spanish"
// // 	}
// // }

// // var res4;

// // $.ajax({
// // 	type: "GET",
// // 	url: "/translator/translate",
// // 	data: req4,
// // 	dataType: "json"
// // }).done(function(result){
// // 	console.log(result)
// // 	res4=result;
// // }).fail(function(err){
// // 	console.log(err);
// // 	res4=err;
// // });


// ////////////////////////
// //Get Translate Page///
// //////////////////////
// var translate_req = {}

// var translate_res;

// $.ajax({
// 	type: "GET",
// 	url: "/translator/",
// 	data: translate_req,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	translate_res=result;
// }).fail(function(err){
// 	console.log(err);
// 	translate_res=err;
// });


// ////////////////////////
// //Get Index Page///////
// //////////////////////
// var req6 = {}

// var res6;

// $.ajax({
// 	type: "GET",
// 	url: "/",
// 	data: req6,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	res6=result;
// }).fail(function(err){
// 	console.log(err);
// 	res6=err;
// });


// ////////////////////////
// //Get Home Page////////
// //////////////////////
// var req9 = {}

// var res9;

// $.ajax({
// 	type: "GET",
// 	url: "/home/",
// 	data: req9,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	res9=result;
// }).fail(function(err){
// 	console.log(err);
// 	res9=err;
// });



// ////////////////////////
// //Logout User//////////
// //////////////////////
// var req7 = {
// 	user : {
// 		_id : 123
// 	}
// }

// var res7;

// $.ajax({
// 	type: "GET",
// 	url: "/logout",
// 	data: req7,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	res7=result;
// }).fail(function(err){
// 	console.log(err);
// 	res7=err;
// });

// ////////////////////////
// //Login User///////////
// //////////////////////
// var req8 = {}

// var res8;

// $.ajax({
// 	type: "POST",
// 	url: "/login",
// 	data: req8,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	res8=result;
// }).fail(function(err){
// 	console.log(err);
// 	res8=err;
// });