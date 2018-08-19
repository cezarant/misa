var port = process.env.PORT || 3000;
var app = require('express')();
var mqtt    = require('mqtt');
var mqtthost = 'm13.cloudmqtt.com';
var client; 
/***********************  Seção MQTT *****************************/
var options = {
	host: mqtthost,
	port: 'xxx',
	protocolId: 'xx',
	secureProtocol: 'xxx',
	protocolId: 'xx',
	protocolVersion: 'x',
	username: 'xx',
  	password: 'x'
};
var http = require('http').Server(app);
var io = require('socket.io')(http);
function iniciaMQTT()
{
    client= mqtt.connect(options);
    client.on('connect', function ()
    {
      client.subscribe(x);  		
    });

    client.on('message', function (topic, message)
    {  
       console.log("Mensagem recebida: "+ message.toString());       
       var json = JSON.parse(message.toString());
       preparaEstoque(json.id,json.retira);	
       comunicaAoCliente("Componente retirado:" + json.nome);			       	       
    });
}
/******************* Seção REST **********************************/
app.get('/iniciamqtt', function (request, response){
  iniciaMQTT();
  response.end('Inicia MQTT');
});

app.get('/retiraled', function (request, response){
  client.publish('/xx','80');       
  response.end('Led_retirado');  
});

app.get('/devolveled', function (request, response){
  client.publish('/xx','80');  
  response.end('Led_devolvido');
});

app.get('/retirabutton', function (request, response)
{
  client.publish('/xx','120');    
  response.end('Button_retirado');
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
