var fs = require( 'fs' )
var path = require( 'path' )
var DHCP = require( '..' )

function bench( name, fn ) {

  var run = {
    begin: () => { time = process.hrtime() },
    end: () => {
      time = process.hrtime( time )
      var ms = ( time[0] * 1e3 ) + ( time[1] / 1e6 )
      console.log( name, ms.toFixed( 2 ), 'ms' )
    },
  }

  fn( run )

}

const ITERATIONS = 1000000

var filename = path.join( __dirname, '..', 'test', 'data', 'ack.bin' )
var buffer = fs.readFileSync( filename )

bench( `DHCP.Packet#parse() ⨉ ${ITERATIONS}`, ( run ) => {

  var packet = new DHCP.Packet()

  run.begin()
  for( var i = 0; i < ITERATIONS; i++ ) {
    packet.parse( buffer, 0 )
  }
  run.end()

})
