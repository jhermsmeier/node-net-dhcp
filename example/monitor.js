var DHCP = require( '..' )
var inspect = require( '../test/inspect' )
var childProcess = require( 'child_process' )

var client = new DHCP.Client()
var server = new DHCP.Server()

client.on( 'message', ( message, rinfo ) => {
  console.log( 'Server message from', rinfo, inspect( message ) )
})

client.on( 'listening', ( socket ) => {
  console.log( 'Client listening on', socket.address() )
})

server.on( 'message', ( message, rinfo ) => {
  console.log( 'Client message from', rinfo, inspect( message ) )
})

server.on( 'listening', ( socket ) => {
  console.log( 'Server listening on', socket.address() )
})

client.listen()
server.listen()
