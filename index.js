var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(4555); //Socket io rodando na porta 4555
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; //Aplicação rodando na porta 3000
var api = express.Router();
var client = express.Router();

var emitir = (req, res, next) => {
	var mensagem = {
		texto: req.query.notificacao || ''
	};

	if (mensagem != '') {
		io.emit('notificacao', mensagem);
		next();
	} else {
		next();
	}
}

app.use(emitir); //Irá inteceptar todas as requests que o 'app' receber
app.use('/api', api);
app.use('/client', client);

api.route('/notificar').get((req, res) => {
	//aqui vamos receber a mensagem
	var mensagem = {
		texto: req.query.notificacao
	}
	res.json(mensagem);
})

client.route('/recebedor').get((req, res) => {
	res.sendFile(__dirname + '/recebedor.html');
})

app.listen(port);
console.log('conectado a porta ' + port);