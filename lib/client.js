var dgram = require( 'dgram' )
var Emitter = require( 'events' )
var DHCP = require( './dhcp' )

class Client extends Emitter {

  constructor( options ) {

    options = options || {}

    super( options )

    this.type = options.type || 'udp4'
    this.reuseAddr = options.reuseAddr !== false
    this.port = options.port || DHCP.CLIENT_PORT
    this.address = options.address || DHCP.INADDR.ANY

    this.socket = null

  }

  send( msg, port, address, callback ) {

    if( typeof port === 'function' ) {
      return this.send( msg, null, null, port )
    } else if( typeof address === 'function' ) {
      return this.send( msg, null, null, address )
    }

    var offset = 0
    var buffer = DHCP.Packet.encode( msg )
    var length = buffer.length

    port = port || DHCP.SERVER_PORT
    address = address || DHCP.INADDR.BROADCAST

    this.socket.send( buffer, offset, length, port, address, ( error ) => {
      callback.call( this, error )
    })

  }

  discover() {
    throw new Error( 'Not implemented' )
  }

  requestAddress() {
    throw new Error( 'Not implemented' )
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
      // switch( packet.data && packet.data.get( 'messageType' ) ) {
      //   case DHCP.MESSAGE.DISCOVER: this.emit( 'discover', packet ); break
      //   case DHCP.MESSAGE.OFFER: this.emit( 'offer', packet ); break
      //   case DHCP.MESSAGE.REQUEST: this.emit( 'request', packet ); break
      //   case DHCP.MESSAGE.DECLINE: this.emit( 'decline', packet ); break
      //   case DHCP.MESSAGE.ACK: this.emit( 'ack', packet ); break
      //   case DHCP.MESSAGE.NAK: this.emit( 'nak', packet ); break
      //   case DHCP.MESSAGE.RELEASE: this.emit( 'release', packet ); break
      //   case DHCP.MESSAGE.INFORM: this.emit( 'inform', packet ); break
      //   default: this.emit( 'unknown', packet ); break
      // }
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

module.exports = Client
