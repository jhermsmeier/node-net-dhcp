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
  var info = {
    type: type[ message.data.get( 53 ) ],
    name: message.data.get( 12 ),
    address: message.data.get( 50 ) || '',
    yourAddress: message.yiaddr,
    device: message.chaddr,
  }
  log.write( `${message.chaddr}\t${message.data.get( 12 )}\n` )
  console.log( `${message.chaddr}\t${message.data.get( 12 )}` )
  // console.log( 'Client message from', inspect( info ) )
  // var str = `${info.type} ${ info.yourAddress ? `for ${info.yourAddress}` : '' } to ${ info.name || message.yiaddr }`
  // console.log( `CLIENT:`, str, `(${info.device})` )
  // say.write( str )
})

server.on( 'listening', ( socket ) => {
  console.log( 'Server listening on', socket.address() )
})

client.listen()
server.listen()
