var assert = require( 'assert' )
var fs = require( 'fs' )
var path = require( 'path' )
var DHCP = require( '..' )
var inspect = require( './inspect' )

describe( 'DHCP.Packet', function() {

  specify( 'can parse an ACK message', function() {

    var filename = path.join( __dirname, 'data', 'ack.bin' )
    var buffer = fs.readFileSync( filename )
    var packet = DHCP.Packet.parse( buffer )

    inspect.log( packet )

  })

})
