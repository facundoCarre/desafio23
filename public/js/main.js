const socket = io.connect();
const denormalize= normalizr.denormalize;
const schema= normalizr.schema;

socket.on('productos', function (productos) {
    console.log('productos socket client')
    document.getElementById('datos').innerHTML = data2TableHBS(productos)
});

const form = document.getElementById('form-productos');
const schemaAuthor = new schema.Entity('author',{},{idAttribute: 'email'});
const schemaMensaje = new schema.Entity('post', {
    author: schemaAuthor
},{idAttribute: '_id'})
const schemaMensajes = new schema.Entity('posts', {
    mensajes: [schemaMensaje]
  },{idAttribute: 'id'})
form.addEventListener('submit', event => {
    event.preventDefault();

    const data = { title: form[0].value, price: form[1].value, thumbnail: form[2].value };
    console.log(data);
    fetch('/api/productos/guardar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(productos => {
        form.reset();
        socket.emit('update', 'ok');
    })
    .catch(error => {
        console.log('ERROR', error);
    });
});


function data2TableHBS(productos) {
    const plantilla = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>

        {{#if productos.length}}
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
                {{#each productos}}
                <tr>
                    <td>{{this.title}}</td>
                    <td>$ {{ this.price }}</td>
                    <td><img width="50" src={{this.thumbnail}} alt="not found"></td>
                </tr>
                {{/each}}
            </table>
        </div>
        {{/if}}
    `

    console.log(productos);
    var template = Handlebars.compile(plantilla);
    let html = template({ productos: productos, hayProductos: productos.length });
    return html;
}

function render(data){
 let date = new Date()
 date = date.getMonth()+1
 console.log('fecah' + date)
  var html = data.map( (elem, index)=> {
    return (`<div>
          <strong style="color:blue">${elem.author}</strong>
          <p style="color:brown">${elem.hora}</p>
          <i style="color:green">${elem.text}</i>
        </div>`)
  }).join(" ");
  document.getElementById('messages').innerHTML = html
}

socket.on("messages",  async (data) => {
    let denormalizedData = denormalize(data.result, schemaMensajes, data.entities);
    console.log(JSON.stringify(denormalizedData,null,3))
  // await render(data)
})

function addMessage(e) {
  var mensaje = {
    author: {
        email:(document.getElementById('email').value),
        nombre:(document.getElementById('persona').value),
        apellido:(document.getElementById('apellido').value),
        edad:(document.getElementById('edad').value),
        alias:(document.getElementById('alias').value),

    },
    text: document.getElementById('texto').value,
};

    socket.emit('new-message', mensaje);
    document.getElementById('texto').value = '';
    document.getElementById('texto').focus();

    return false;
}

chat.addEventListener("input", function(){
  if(username.value.length > 3 && texto.value.length > 3){
    boton.disabled = false
  }else{
    boton.disabled = true
  }
})
