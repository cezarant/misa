var port = process.env.PORT || 3000;
var app = require('express')();
var mqtt    = require('mqtt');
var client; 
/***********************  Seção MQTT *****************************/
var options = 
{
	host:            process.env.mqtthost,
	port:            process.env.porta,
	protocolId:      process.env.protocolId,
	secureProtocol:  process.env.protocolVersion,	
	protocolVersion: 3,
	username:        process.env.username,
  	password:        process.env.password
};
var http = require('http').Server(app);
var io = require('socket.io')(http);
function iniciaMQTT()
{
    var msgErro =    "Dados de conexao:<br>"+ 
                     "Log de dados de conexao:<br>"+ 	
		     "Mqtthost:" + process.env.mqtthost +"<br>"+ 	
		     "Porta:" + process.env.porta +"<br>"+ 	
		     "ProtocoloId:" + process.env.protocolId +"<br>"+ 	
		     "Secure Protocol:" + process.env.secureProtocol +"<br>"+ 	
		     "Protocol Version:" + process.env.protocolVersion +"<br>"+ 	
		     "User name:" + process.env.username+"<br>" + 	
		     "Password:" + process.env.password   
    
    comunicaAoCliente(msgErro);	

    client= mqtt.connect(options);
    client.on('connect', function ()
    {
	      client.subscribe(process.env.topicosubscribe);  		
      	      comunicaAoCliente("Conexao MQTT realizada com sucesso!");			        
    });

    client.on('error', function (topic, message)
    {
       var msgErro = "Nao foi possivel se conectar:<br>"+ 
                     "Log de dados de conexao:<br>"+ 	
		     "Mqtthost:" + process.env.mqtthost +"<br>"+ 	
		     "Porta:" + process.env.porta +"<br>"+ 	
		     "ProtocoloId:" + process.env.protocolid +"<br>"+ 	
		     "Secure Protocol:" + process.env.secureprotocol +"<br>"+ 	
		     "Protocol Version:" + process.env.protocolversion +"<br>"+ 	
		     "User name:" + process.env.username+"<br>" + 	
		     "Password:" + process.env.password   
       comunicaAoCliente(msgErro);			 	       
    });

    client.on('message', function (topic, message)
    {  
       console.log("Mensagem recebida: "+ message.toString());              
       comunicaAoCliente("Mensagem recebida:" + message.toString());			      	  });
}
/******************* Seção REST **********************************/
app.get('/iniciamqtt', function (request, response){
  iniciaMQTT();
  comunicaAoCliente('MQTT iniciado! :)');  
  response.end('MQTT iniciado!');  
});

app.get('/retiraled', function (request, response){
  client.publish(process.env.topicopublish,'2');       
  response.end('Led_retirado');  
});

app.get('/devolveled', function (request, response){
  client.publish(process.env.topicopublish,'2');    
  response.end('Led_devolvido');
});

app.get('/retirabutton', function (request, response){
  client.publish(process.env.topicopublish,2);    
  response.end('Button_retirado');
});

app.get('/devolvebutton', function (request, response){
  client.publish(process.env.topicopublish,'2'); 
  response.end('Button_devolvido');
});
/**************************** Seção HTTP **********************************/
http.listen(port, function()
{
  console.log('conectado em ' + port);      
});

app.get('/', function(req, res)
{  
  res.sendFile(__dirname + '/index.html');
}); 

io.on('connection', function(socket)
{
  socket.on('chat message', function(etapaAtual)
  {	
      	mediador(etapaAtual);	       
  });
});

function comunicaAoCliente(msg)
{
   io.emit('chat message', msg);
} 
function mediador(etapa)
{
    console.log(etapa); 
    if(etapa == "state0")
    {	
	 comunicaAoCliente('MQTT iniciado! :)');
         iniciaMQTT();	
    }
    if(etapa == "state1")
    {	
	 comunicaAoCliente('Levantando o elevador...');
         client.publish(process.env.topicopublish,'2');    	
    }
    if(etapa == "state2")
    {	
	 comunicaAoCliente('Abaixando o elevador...');
         client.publish(process.env.topicopublish,'1');    	
    }	
    if(etapa == "state3")
    {	
	 comunicaAoCliente('Abaixando o elevador...');
         client.publish(process.env.topicosubscribe,'1');    	
    }		
    if(etapa == "state4")
    {	
	 comunicaAoCliente('Abaixando o elevador...');
         client.publish(process.env.topicosubscribe,'2');    	
    }
    if(etapa == "state5")
    {	
	 comunicaAoCliente('Abaixando o elevador...');
         client.publish(process.env.topicosubscribe,'3');    	
    }
    if(etapa == "state6")
    {	
	 comunicaAoCliente('Abaixando o elevador...');
         client.publish(process.env.topicosubscribe,'4');    	
    }
} 
/***************************  FIM MQTT ***********************************/
/**************************************************************************/
console.log('Server running at http://localhost:8080/');
