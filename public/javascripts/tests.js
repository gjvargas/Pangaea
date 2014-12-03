//TESTING STRATEGY OVERVIEW
//create user
//edit user
//get user page
//get translation
//get translate page
//get index page



/////////////////////
//duplicate email//
///////////////////
var duplicate_email_req = {
	username : "user2",
	email: "user1@mit.edu",
	password: "password1",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var duplicate_email_res;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: duplicate_email_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	duplicate_email_res = result;
}).fail(function(err){
	console.log(err);
	duplicate_email_res = err;
});

/////////////////////
//duplicate username//
///////////////////
var duplicate_username_req = {
	username : "user1",
	email: "user2@mit.edu",
	password: "password1",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var duplicate_username_res;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: duplicate_username_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	duplicate_username_res = result;
}).fail(function(err){
	console.log(err);
	duplicate_username_res = err;
});



/////////////////////
//short password//
///////////////////
var short_password_req = {
	username : "user1",
	email: "user1@mit.edu",
	password: "123",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var short_password_res;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: short_password_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	short_password_res = result;
}).fail(function(err){
	console.log(err);
	short_password_res = err;
});


/////////////////////
//email format //
///////////////////
var email_format_req = {
	username : "user1",
	email: "user1@mit",
	password: "123",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var email_format_res;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: email_format_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	email_format_res = result;
}).fail(function(err){
	console.log(err);
	email_format_res = err;
});


/////////////////////
//Create Good User//
///////////////////
var good_user_req = {
	username : "user1",
	email: "user1@mit.edu",
	password: "password1",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var good_user_res;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: good_user_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	good_user_res = result;
}).fail(function(err){
	console.log(err);
	good_user_res = err;
});



///////////////////
//Edit User Test//
/////////////////
var edit_req = {
	proficiencies: ["English","Arabic"],
	desires: ["Spanish","Portuguese"]
}

var edit_res;

$.ajax({
	type: "POST",
	url: "/users/edit",
	data: edit_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	edit_res = result;
}).fail(function(err){
	console.log(err);
	edit_res = err;
});

///////////////////
//Get User Page///
/////////////////
var user_page_req = {
	user : good_user_res
}

var user_page_res;

$.ajax({
	type: "GET",
	url: "/users/",
	data: user_page_req,
	dataType: "json"
}).done(function(result){
	console.log(result)
	user_page_res=result;
}).fail(function(err){
	console.log(err);
	user_page_res=err;
});


/////////////////////
//Get Translation///
///////////////////
// var req4 = {
// 	query : {
// 		text : "hello",
// 		language1 : "English",
// 		language2 : "Spanish"
// 	}
// }

// var res4;

// $.ajax({
// 	type: "GET",
// 	url: "/translator/translate",
// 	data: req4,
// 	dataType: "json"
// }).done(function(result){
// 	console.log(result)
// 	res4=result;
// }).fail(function(err){
// 	console.log(err);
// 	res4=err;
// });


////////////////////////
//Get Translate Page///
//////////////////////
var req5 = {}

var res5;

$.ajax({
	type: "GET",
	url: "/translator/",
	data: req5,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res5=result;
}).fail(function(err){
	console.log(err);
	res5=err;
});


////////////////////////
//Get Index Page///////
//////////////////////
var req6 = {}

var res6;

$.ajax({
	type: "GET",
	url: "/",
	data: req6,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res6=result;
}).fail(function(err){
	console.log(err);
	res6=err;
});


////////////////////////
//Get Home Page////////
//////////////////////
var req9 = {}

var res9;

$.ajax({
	type: "GET",
	url: "/home/",
	data: req9,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res9=result;
}).fail(function(err){
	console.log(err);
	res9=err;
});



////////////////////////
//Logout User//////////
//////////////////////
var req7 = {
	user : {
		_id : 123
	}
}

var res7;

$.ajax({
	type: "GET",
	url: "/logout",
	data: req7,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res7=result;
}).fail(function(err){
	console.log(err);
	res7=err;
});

////////////////////////
//Login User///////////
//////////////////////
var req8 = {}

var res8;

$.ajax({
	type: "POST",
	url: "/login",
	data: req8,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res8=result;
}).fail(function(err){
	console.log(err);
	res8=err;
});


//////////////////////////////////////
//Unit Tests Below check Assertions//
////////////////////////////////////
test( "Unit Tests", function( assert ) {
  assert.ok( createsuccess == 200, "create user" );
  assert.ok( createerror == undefined, "edit user" );
  assert.ok( res3 == 200, "get user page" );
  //assert.ok( res4 == 200, "get translation" );
  assert.ok( res5 == 5, "get translate page" );
  assert.ok( res6 == 6, "get index page" );
  assert.ok( res9 == 9, "get index page" );
  assert.ok( res7 == 7, "get logout page" );
  assert.ok( res8 == 8, "get login page" );
});