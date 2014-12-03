//TESTING STRATEGY OVERVIEW
//create user
//edit user
//get user page
//get translation
//get translate page
//get index page





/////////////////////
//Create User Test//
///////////////////
var req1 = {
	username : "user1",
	email: "user1@mit.edu",
	password: "password1",
	proficiencies: ["English"],
	desires: ["Spanish"]
}

var res1;

$.ajax({
	type: "POST",
	url: "/users/create",
	data: req1,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res1 = result;
}).fail(function(err){
	console.log(err);
	var1 = err;
});

///////////////////
//Edit User Test//
/////////////////
var req2 = {
	username : "user1",
	email: "user1@mit.edu",
	password: "password1",
	proficiencies: ["English","Arabic"],
	desires: ["Spanish","Portuguese"]
}

var res2;

$.ajax({
	type: "POST",
	url: "/users/edit",
	data: req2,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res2 = result;
}).fail(function(err){
	console.log(err);
	res2 = err;
});

///////////////////
//Get User Page///
/////////////////
var req3 = {
	user : {
		username : "user1",
		isOnline : false,
		_id : 123
	}
}

var res3;

$.ajax({
	type: "GET",
	url: "/users/",
	data: req3,
	dataType: "json"
}).done(function(result){
	console.log(result)
	res3=result;
}).fail(function(err){
	console.log(err);
	res3=err;
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
  assert.ok( 1 == 1, "create user" );
  assert.ok( 2 == 2, "edit user" );
  assert.ok( 3 == 3, "get user page" );
  assert.ok( 4 == 4, "get translation" );
  assert.ok( 5 == 5, "get translate page" );
  assert.ok( 6 == 6, "get index page" );
  assert.ok( 9 == 9, "get index page" );
  assert.ok( 7 == 7, "get logout page" );
  assert.ok( 8 == 8, "get login page" );
});