var dgram = require( 'dgram' )
var Emitter = require( 'events' )
var DHCP = require( './dhcp' )

class Server extends Emitter {

  constructor( options ) {

    options = options || {}

    super()

    this.port = DHCP.SERVER_PORT
    this.address = DHCP.INADDR.ANY
    this.type = 'udp4'
    this.reuseAddr = options.reuseAddr !== false
    this.socket = null

  }

  listen( port, address, callback ) {

    if( typeof port === 'function' ) {
      return this.listen( null, null, port )
    } else if( typeof address === 'function' ) {
      return this.listen( port, null, address )
    }

    port = port || this.port
    address = address || this.address

    this.socket = dgram.createSocket({
      type: this.type,
      reuseAddr: this.reuseAddr,
      ipv6Only: this.type === 'udp6' ? true : false, // TODO: Make this configurable
    })

    this.socket.on( 'message', ( msg, rinfo ) => {
      var packet = DHCP.Packet.decode( msg )
      this.emit( 'message', packet, rinfo, msg )
    })

    this.socket.on( 'error', ( error ) => {
      this.emit( 'error', error )
    })

    this.socket.on( 'listening', () => {
      this.emit( 'listening', this.socket )
    })

    this.socket.on( 'close', () => {
      this.emit( 'close', this.socket )
    })

    this.socket.bind( port, address, () => {
      this.socket.setBroadcast( true )
      if( typeof callback === 'function' ) {
        callback.call( this )
      }
    })

  }

  close( callback ) {
    this.socket.close( callback )
  }

}

module.exports = Server
