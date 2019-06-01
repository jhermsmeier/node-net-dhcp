var DHCP = require( '..' )
var inspect = require( '../test/inspect' )

var server = new DHCP.Server()

server.on( 'error', ( error ) => {
  console.log( error )
})

server.on( 'message', ( message, rinfo ) => {
  console.log( 'Message from', rinfo, inspect( message ) )
})

server.on( 'listening', ( socket ) => {
  console.log( 'Listening on', socket.address() )
})

server.listen()
