#include <SoftwareSerial.h>
SoftwareSerial mySerial(11, 12); 
String command = ""; 
int incomingByte = 0;

#define pinEnableMotorA   8
#define pinSentido1MotorA 2
#define pinSentido2MotorA 3
  
#define pinEnableMotorB   9
#define pinSentido1MotorB 4
#define pinSentido2MotorB 5

#define pinCarrinhoDireita  1
#define pinCarrinhoEsquerda 7

#define larguraCarrinho 530

int valorDelay = 2500;
char          buff [100];
int           val = 0;
volatile byte index;
volatile bool receivedone;   
int incomingByte = 0; 
String msgReceveidFromNode = "";

int carrinho = 0; 
void setup() 
{
   Serial.begin(9600); 

   
   /*index = 0;
   receivedone = false;
    
   // pinMode(ledComunicacao,OUTPUT);
   pinMode(pinEnableMotorA,OUTPUT);
   pinMode(pinSentido1MotorA,OUTPUT);
   pinMode(pinSentido2MotorA,OUTPUT); 
     
   Serial.begin(9600);
   Serial.println("Type AT commands!");
   mySerial.begin(9600);

   pinMode(pinCarrinhoDireita,OUTPUT);
   pinMode(pinCarrinhoEsquerda,OUTPUT);
   inicioCurso(); */
}
void rotorNormal()
 {
    Serial.println("rotor normal...");
    analogWrite(pinEnableMotorB,255);        
    delay(700); 

    digitalWrite(pinSentido1MotorB,LOW);
    digitalWrite(pinSentido2MotorB,HIGH);
    
    delay(700); 
    
    digitalWrite(pinSentido1MotorB,LOW);
    digitalWrite(pinSentido2MotorB,LOW);      

    delay(700);     
 }
 void rotorLevantar()
 {
    Serial.println("rotor pra levantar...");
    analogWrite(pinEnableMotorB,255);        
    delay(700); 

    digitalWrite(pinSentido1MotorB,HIGH);
    digitalWrite(pinSentido2MotorB,LOW);
    
    delay(700); 
    
    digitalWrite(pinSentido1MotorB,LOW);
    digitalWrite(pinSentido2MotorB,LOW);      

    delay(700);     
 }
 void levantarCavalete()
 {
    Serial.println("levantando cavalete...");
    analogWrite(pinEnableMotorA,255);        

    delay(950);
    
    digitalWrite(pinSentido1MotorA,HIGH);
    digitalWrite(pinSentido2MotorA,LOW);
    
    delay(700); 
    
    digitalWrite(pinSentido1MotorA,LOW);
    digitalWrite(pinSentido2MotorA,LOW);             
 }
 void abaixarCavalete()
 { 
    Serial.println("avancando cavalete...");
    analogWrite(pinEnableMotorA,255);        
    delay(700); 

    digitalWrite(pinSentido1MotorA,LOW);
    digitalWrite(pinSentido2MotorA,HIGH);
    
    delay(700); 
    
    digitalWrite(pinSentido1MotorA,LOW);
    digitalWrite(pinSentido2MotorA,LOW);      

    delay(700);     
 }
 void moverCarrinhoDireita(){
    Serial.println("avancando cavalete...");
    
    for(int i=larguraCarrinho;i>0;i--){
        analogWrite(pinCarrinhoDireita,i); 
        analogWrite(pinCarrinhoEsquerda,0);
        Serial.println(i);
        delayMicroseconds(50);
    }  
    
    /*digitalWrite(pinCarrinhoDireita,HIGH);
    digitalWrite(pinCarrinhoEsquerda,LOW);
    
    delay(700); 
    
    digitalWrite(pinCarrinhoDireita,LOW);
    digitalWrite(pinCarrinhoEsquerda,LOW);*/     
 }  
 void inicioCurso(){
   Serial.println("avancando cavalete...");     
   for(int i=0;i<larguraCarrinho;i++){
        analogWrite(pinCarrinhoDireita,0); 
        analogWrite(pinCarrinhoEsquerda,i);
        //Serial.println(i);
        delayMicroseconds(100);
   }
 } 
 
 void primeiraCaixa()
 {
    Serial.println("Primeira caixa");
    for(int i=0;i<larguraCarrinho;i++){
        analogWrite(pinCarrinhoDireita,0); 
        analogWrite(pinCarrinhoEsquerda,i);
        Serial.println(i);
        delayMicroseconds(50);
    }
    /*digitalWrite(pinCarrinhoDireita,LOW);
    digitalWrite(pinCarrinhoEsquerda,HIGH);
    
    delay(700); 
    
    digitalWrite(pinCarrinhoDireita,LOW);
    digitalWrite(pinCarrinhoEsquerda,LOW);*/ 
 }
 void comunicaChegadaSPI()
 {
    /*digitalWrite(ledComunicacao,HIGH);
    delay(1000);
    digitalWrite(ledComunicacao,LOW);
    delay(1000);*/
 }
 void selecionaComando(String viComando)
 {
     Serial.println("Comando recebido...");
     Serial.println(viComando);
     delay(100);
          
     if(viComando == "CARD\n")
        primeiraCaixa();

     if(viComando == "CARE\n")
        primeiraCaixa();
     
     if(viComando == "ABXL\n")
        abaixarCavalete();
            
     if(viComando == "LEVL\n")
        levantarCavalete();
      
     if(viComando == "ROTN\n")
        rotorNormal();

     if(viComando == "ROTL\n")
        rotorLevantar(); 
 }
 void loop() 
 {   
   if (Serial.available() > 0)
   {
      // lê do buffer o dado recebido:
      incomingByte = Serial.read();

      // responde com o dado recebido:
      Serial.print("I received: ");
      Serial.println(incomingByte, DEC);
   }
  
  /*if (mySerial.available()) // Read device output if available.
  {
    while(mySerial.available()) // While there is more to be read, keep reading.
   {
     delay(10); //Delay added to make thing stable
     char c = mySerial.read(); //Conduct a serial read
     command += c; //build the string.
    }
    selecionaComando(command);        
    command = ""; // 
  }
  if (Serial.available())
  {
    delay(10); // The DELAY! ********** VERY IMPORTANT *******
    mySerial.write(Serial.read());
  } */ 
}
