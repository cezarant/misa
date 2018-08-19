var port = process.env.PORT || 3000;
var app = require('express')();
var mqtt    = require('mqtt');
var client; 
/***********************  Seção MQTT *****************************/
var options = 
{
	host: 'm13.cloudmqtt.com',
	port: 11249,
	protocolId: 'MQIsdp',
	secureProtocol: 'TLSv1_method',	
	protocolVersion: 3,
	username: 'fxccbsjv',
  	password: '5i6sXGxi4zVL'
};
var http = require('http').Server(app);
var io = require('socket.io')(http);
function iniciaMQTT()
{
    var msgErro =    "Dados de conexao:<br>"+ 
                     "Log de dados de conexao:<br>"+ 	
		     "Mqtthost:" + process.env.mqtthost +"<br>"+ 	
		     "Porta:" + process.env.porta +"<br>"+ 	
		     "ProtocoloId:" + process.env.protocolid +"<br>"+ 	
		     "Secure Protocol:" + process.env.secureprotocol +"<br>"+ 	
		     "Protocol Version:" + process.env.protocolversion +"<br>"+ 	
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
  client.publish(process.env.topicosubscribe,'80');       
  response.end('Led_retirado');  
});

app.get('/devolveled', function (request, response){
  client.publish(process.env.topicosubscribe,'80');    
  response.end('Led_devolvido');
});

app.get('/retirabutton', function (request, response){
  client.publish(process.env.topicosubscribe,'120');    
  response.end('Button_retirado');
});

app.get('/devolvebutton', function (request, response){
  client.publish(process.env.topicosubscribe,'120'); 
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
    if(etapa == "etapa0")
    {	
	 comunicaAoCliente('MQTT iniciado! :)');
         iniciaMQTT();	
    }	
} 
/***************************  FIM MQTT ***********************************/
/**************************************************************************/
console.log('Server running at http://localhost:8080/');
