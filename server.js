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
const schemaAuthor = new schema.Entity('author',{},{idAttribute: 'email'});
const schemaMensaje = new schema.Entity('post', {
    author: schemaAuthor
},{idAttribute: '_id'})
const schemaMensajes = new schema.Entity('posts', {
    mensajes: [schemaMensaje]
  },{idAttribute: 'id'})
async function getAll() {
    try {
        let mensajes = await ApiMensajes.findAll()
        //print(mensajes)
        let mensajesConId = { 
            id: 'mensajes', 
            mensajes : mensajes.map( mensaje => ({...mensaje._doc}))
        }
        let mensajesConIdN = normalize(mensajesConId, schemaMensajes)
        console.log('mensaje con id ' + JSON.stringify(mensajesConIdN,null,3))
        return mensajesConIdN;
    }
    catch {
        return []
    }
}
io.on('connection', async socket => {
    //socket.emit('messages',  await ApiMensajes.findAll());
    /*socket.on('update', data => {
        io.sockets.emit('productos', productos.enlistar());
    });*/
    socket.on('new-message', async function (data) {
        const resultado = await ApiMensajes.create(data);
        console.log('normalizado' + JSON.stringify(getAll(),null,3))
        socket.emit('messages', await getAll());
        /*let archivo = await fs.promises.readFile(rutaMensajes, "utf-8");
        let msg = JSON.parse(archivo,null,"\t")
        msg.push(data);
        //comentario de commit
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
