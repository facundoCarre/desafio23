const express = require('express');
const fs = require('fs');
const app = express();
const { normalize, schema } = require('normalizr');

const handlebars = require('express-handlebars');
  const http = require('http').Server(app);
    const io = require('socket.io')(http);
const rutaMensajes = 'files/mensajes.txt'
const ApiMensajes = require ('./api/messages')
require('./database/connection')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);

app.set("view engine", "hbs");
app.set("views", __dirname + '/views');


io.on('connection', async socket => {
    socket.emit('messages',  await ApiMensajes.findAll());
    /*socket.on('update', data => {
        io.sockets.emit('productos', productos.enlistar());
    });*/
    socket.on('new-message', async function (data) {
        const resultado = await ApiMensajes.create(data);
        console.log('nuevo mensaje ' + JSON.stringify(resultado))
        const schemaAuthor = new schema.Entity('author',{},{idAttribute: 'author.email'});
        const schemaMensaje = new schema.Entity('post', {
            author: schemaAuthor
        },{idAttribute: '_id'})
        const schemaMensajes = new schema.Entity('posts', {
            mensajes: [schemaMensaje]
          },{idAttribute: 'id'})
        let denormalizedData = normalize(await ApiMensajes.findAll(), schemaMensajes);
        console.log('normalizado' + JSON.stringify(denormalizedData))
        //socket.emit('messages', denormalizedData);
        /*let archivo = await fs.promises.readFile(rutaMensajes, "utf-8");
        let msg = JSON.parse(archivo,null,"\t")
        msg.push(data);
        await fs.promises.writeFile(rutaMensajes, JSON.stringify(msg))
        io.sockets.emit('messages', await leerMensajes())*/
    });
});

app.use((err, req, res, next) => {
    console.error(err.message);
    return res.status(500).send('Algo se rompio!');
});


const router = require('./router/routes');
app.use("/api",router);

const PORT = 8080;


const server = http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});


server.on('error', error => {
    console.log('error en el servidor:', error);
});
