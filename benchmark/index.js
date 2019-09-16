var fs = require( 'fs' )
var path = require( 'path' )
var bench = require( 'nanobench' )
var DHCP = require( '..' )

const ITERATIONS = 1000000

var filename = path.join( __dirname, '..', 'test', 'data', 'ack.bin' )
var buffer = fs.readFileSync( filename )

bench( `DHCP.Packet#parse() ⨉ ${ITERATIONS}`, ( run ) => {

  var packet = new DHCP.Packet()

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    packet.parse( buffer, 0 )
  }
  run.end()

})

bench( `DHCP.Packet#write() ⨉ ${ITERATIONS}`, ( run ) => {

  var packet = DHCP.Packet.decode( buffer )
  var output = Buffer.alloc( buffer.length )

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    packet.write( output, 0 )
  }
  run.end()

})
