var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var port = process.env.PORT || 3000;
var app = require('express')();
var pg = require('pg');
var mqtt    = require('mqtt');
var mqtthost = 'm13.cloudmqtt.com';
var client; 
/***********************  Seção MQTT *****************************/
var options = {
	host: mqtthost,
	port: xxx,
	protocolId: xx,
	secureProtocol: xxx,
	protocolId: xx,
	protocolVersion: x,
	username: xx,
  	password: x
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
/***************************************************************/
/*********************** E-Mail ********************************/
var transporte = nodemailer.createTransport(smtpTransport(
{
   service: 'Gmail',
   auth: {
       user: xx,
       pass: 'xx'
   }
}));
/****************** Camada de Negócio **********************************/
function excluiEstoque(request, response)
{
   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("DELETE FROM estoque", function(err, result) {
      done();
      if (err)
      { 
           console.error(err); response.send("Error " + err); }
      else
      { 	
	  response.end("REGISTROS EXCLUIDOS");                       
      }
      });
  });	
}
function recuperaEstoque(request, response)
{    
  pg.connect(process.env.DATABASE_URL, function(err, client, done) 
  {
      client.query("SELECT * FROM estoque", function(err, result) 
      {
         done();
         if (err)
         {  
            console.error(err); response.send("Error " + err); }
         else
         {  	  
	    response.end(JSON.stringify(result.rows, null, "    "));                       
         }
      });
  });  	
}
function preparaEstoque(id,retira)
{
  pg.connect(process.env.DATABASE_URL, function(err, client, done) 
  {
    client.query("SELECT id,qtd FROM estoque where id ="+ id, function(err, result)
    {
      done();
      if (err)
      { 
          return console.error(err); 
      }
      else
      { 
	  var vi_qtd = parseInt(result.rows[0].qtd); 
	  if(retira == 1) 	
	     vi_qtd = vi_qtd - 1;		 
	  else 
	     vi_qtd = vi_qtd + 1;		 
			 
	  return atualizaEstoque(vi_qtd,result.rows[0].id); 			  
      }
    });
  });  	
}
function criaEstoque(request, response)
{
  pg.connect(process.env.DATABASE_URL, function(err, client, done) 
  {
      client.query("create table estoque(id int,qtd int,name varchar(50))", 
      function(err, result) 
      {
      	 done();
	 if (err)
	 { 		
	    console.error(err);            
         }
	 else
	 { 	
           response.end('Registro inserido');                       
	 }
      });
  });
}

function insereEstoque(request, response)
{
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("insert into estoque(id,qtd,name) values(1,12,'Led')", function(err, result) {
      done();
      if (err)
      { 
	  comunicaAoCliente('Erro em insereEstoque'+err)           
	  console.error(); 
      }
      else
      { 	
	  console.log('Registro inserido');
	  response.end('Registro inserido');                       
      }
      });
  });
}

function atualizaEstoque(qtd,id)
{
   pg.connect(process.env.DATABASE_URL, function(err, client, done)
   {
    client.query("update estoque set qtd = "+ qtd +" where id="+ id, function(err, result) 
    {
      done();
      if (err)
      { 
           console.error(err); 
	   return "Error " + err; 
      }
      else
      { 	
	  return 'Registro inserido';                       
      }
    });
  });	
}
function enviaEmail()
{  
   var email = 
   {
       from: 'xx', 
       to  : 'xx', 
       subject: 'ToolTeresa',  
       html: 'Atenção, há componentes faltando na sua caixa de ferramentas.Detalhes em: https://servidormqtt.herokuapp.com/get'  
   };	

   transporte.sendMail(email, function(err, info)
   {
       if(err)
         throw err; 

       console.log('Email enviado! Leia as informações adicionais: ', info);
   });
}
/******************* Seção REST **********************************/
app.get('/delete', function (request, response){
  excluiEstoque(request, response);
});

app.get('/iniciamqtt', function (request, response){
  iniciaMQTT();
  response.end('Inicia MQTT');
});

app.get('/email', function (request, response){
  enviaEmail();
  response.end('Email enviado');  
});

app.get('/retiraled', function (request, response){
  client.publish('/xx','80');     
  enviaEmail();
  response.end('Led_retirado');  
});

app.get('/devolveled', function (request, response){
  client.publish('/xx','80');  
  enviaEmail();
  response.end('Led_devolvido');
});

app.get('/retirabutton', function (request, response){
  client.publish('/xx','120');  
  enviaEmail();
  response.end('Button_retirado');
});

app.get('/devolvebutton', function (request, response){
  client.publish('/xx','120');  
  enviaEmail();
  response.end('Button_devolvido');
});

app.get('/estoque', function (request, response){  
  res.sendFile(__dirname + '/estoque.html');
});

app.get('/get', function (request, response){  
  recuperaEstoque(request, response);
});

app.get('/post', function (request, response) {
    insereEstoque(request, response);
});

app.get('/retiraestoque', function (request, response)
{
  response.end(preparaEstoque(1,true));
});

app.get('/colocaestoque', function (request, response)
{
  response.end(preparaEstoque(request, response,1,false));
});
 
app.get('/criaestoque', function (request, response)
{
  response.end(criaEstoque());
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
