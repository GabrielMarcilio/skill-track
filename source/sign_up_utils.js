function signUp(){
	/**
	 * Read the input performed by user to create e new user in the database
	 */
	console.log('Preparing sign up')
	var name = document.getElementById("signup-name").value
    var email = document.getElementById("signup-email").value
    var password = document.getElementById("signup-pass").value
    var confirmed_password = document.getElementById("signup-pass-confirm").value
    
    var alerts =[];
    if(name == ''){
    	alerts.push('Nome em Branco');
    }
    
    if(email == ''){
    	alerts.push('Email em Branco');
    }

    if(password.length < 5){
    	alerts.push('A senha deve ter no mínimo 5 caracteres');
    }
    else if(password !== confirmed_password){
    	alerts.push('Erro ao confirmar a senha');
    }
    
    if(alerts.length > 0){
    	var pendencies = alerts.join('\n')
    	var message = 'Resolva as pendências:\n' + pendencies
    	alert(message);
    }
    else{
    	console.log('Valid value sent')
    	var user_info ={
    		'name':name,
    		'email':email,
    		'password': password,
    		'skills':'',
    		'passions':''
    	}
    	
    	console.log('Sending post')
	   	$.post(
	   		"/signup",
	   		{'user_info':user_info},
	   	    function(data, status){
	   	        alert("Update person result: " + data + "\nStatus: " + status);
	       })
	       .fail(function(response) {
	    	    alert('Error: ' + response.responseText);
	       });
    }
    	
    	
}