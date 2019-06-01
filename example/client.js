var DHCP = require( '..' )
var inspect = require( '../test/inspect' )

var client = new DHCP.Client()

client.on( 'error', ( error ) => {
  console.log( error )
})

client.on( 'message', ( message, rinfo ) => {
  console.log( 'Message from', rinfo, inspect( message ) )
})

client.on( 'listening', ( socket ) => {
  console.log( 'Listening on', socket.address() )
})

client.listen()
