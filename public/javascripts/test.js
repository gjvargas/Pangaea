$(function(){

	$('.create_exchange').click(function(){
		var user_id = $(this).data('user-id');

		$.post('/exchanges/create',
			{user_id: user_id},
			function(data){
				console.log('success');
				console.log(data);
			}
		)
	})
})