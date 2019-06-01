var DHCP = require( './dhcp' )

function readASCII( buffer, offset, length ) {
  var eod = buffer.indexOf( 0x00, offset )
  eod = Math.min( Math.max( eod, 0 ), offset + length )
  return buffer.toString( 'ascii', offset, eod )
}

function readIPv4( buffer, offset ) {
  var ip = ''
  ip += buffer[ offset + 0 ] + '.'
  ip += buffer[ offset + 1 ] + '.'
  ip += buffer[ offset + 2 ] + '.'
  ip += buffer[ offset + 3 ]
  return ip
}

function readHWAddr( buffer, offset, length ) {
  length = Math.min( length, 16 )
  var hwaddr = ''
  for( var i = 0; i < length; i++ ) {
    if( i !== 0 ) hwaddr += ':'
    hwaddr += buffer[ offset + i ].toString( 16 ).padStart( 2, '0' )
  }
  return hwaddr
}

class Packet {

  constructor() {

    /** @type {Number} Message op code / message type */
    this.op = 0

    /** @type {Number} Hardware type */
    this.htype = 0
    /** @type {Number} Hardware address length in bytes */
    this.hlen = 0

    /** @type {Number} Client sets to zero, optionally used by
        relay agents when booting via a relay agent */
    this.hops = 0

    /** @type {Number} Transaction Identifier */
    this.xid = 0

    /** @type {Number} Seconds elapsed since begin of
        address acquisition / renewal process */
    this.secs = 0
    /** @type {Number} Flags */
    this.flags = 0

    /** @type {Number} Client IP address */
    this.ciaddr = 0
    /** @type {Number} Your IP address */
    this.yiaddr = 0
    /** @type {Number} Server IP address */
    this.siaddr = 0
    /** @type {Number} Gateway IP address */
    this.giaddr = 0

    /** @type {Buffer} Client Hardware Address (MAC) */
    this.chaddr = '' // Buffer.alloc( 16 )

    /** @type {String} Server host name (optional) */
    this.sname = ''
    /** @type {String} Boot file name, "generic"
        name or null in DHCPDISCOVER, fully qualified
        directory-path name in DHCPOFFER */
    this.file = ''

    /** @type {Number} Cookie (optional) */
    this.cookie = DHCP.OPTION_COOKIE

    /** @type {Packet.Options} Options */
    this.data = null

  }

  static parse( buffer, offset ) {
    return new Packet().parse( buffer, offset )
  }

  parse( buffer, offset ) {

    offset = offset || 0

    if( ( buffer.length - offset ) < Packet.MIN_SIZE ) {
      throw new Error( `Packet too small, need at least ${Packet.MIN_SIZE} bytes` )
    }

    this.op = buffer.readUInt8( offset + 0 )

    this.htype = buffer.readUInt8( offset + 1 )
    this.hlen = buffer.readUInt8( offset + 2 )
    this.hops = buffer.readUInt8( offset + 3 )

    this.xid = buffer.readUInt32BE( offset + 4 )

    this.secs = buffer.readUInt16BE( offset + 8 )
    this.flags = buffer.readUInt16BE( offset + 10 )

    this.ciaddr = readIPv4( buffer, offset + 12 ) // buffer.readUInt32BE( offset + 12 )
    this.yiaddr = readIPv4( buffer, offset + 16 ) // buffer.readUInt32BE( offset + 16 )
    this.siaddr = readIPv4( buffer, offset + 20 ) // buffer.readUInt32BE( offset + 20 )
    this.giaddr = readIPv4( buffer, offset + 24 ) // buffer.readUInt32BE( offset + 24 )

    // this.chaddr = Buffer.alloc( this.hlen ) // buffer.slice( offset + 28, offset + 44 )
    // buffer.copy( this.chaddr, 0, offset + 28 )
    this.chaddr = readHWAddr( buffer, offset + 28, this.hlen )

    this.sname = readASCII( buffer, offset + 44, 64 )
    this.file = readASCII( buffer, offset + 108, 128 )

    if( offset + Packet.MIN_SIZE < buffer.length ) {
      this.cookie = buffer.readUInt32BE( offset + Packet.MIN_SIZE )
      if( this.cookie !== DHCP.OPTION_COOKIE ) {
        throw new Error( `Invalid DHCP option cookie; expected 0x${DHCP.OPTION_COOKIE.toString(16)}, got 0x${this.cookie.toString(16)}` )
      }
      this.data = new Packet.Options().parse( buffer, offset + 240 )
    } else {
      this.cookie = null
      this.data = null
    }

    return this

  }

  write( buffer, offset ) {

    offset = offset || 0

    var length = Packet.MIN_SIZE + offset

    length += this.data ? this.data.encodingLength() : 0

    buffer = buffer || Buffer.alloc( length )

    offset = buffer.writeUInt8( this.op, offset )
    offset = buffer.writeUInt8( this.htype, offset )
    offset = buffer.writeUInt8( this.hlen, offset )
    offset = buffer.writeUInt8( this.hops, offset )
    offset = buffer.writeUInt32BE( this.xid, offset )
    offset = buffer.writeUInt16BE( this.secs, offset )
    offset = buffer.writeUInt16BE( this.flags, offset )
    offset = buffer.writeUInt32BE( this.ciaddr, offset )
    offset = buffer.writeUInt32BE( this.yiaddr, offset )
    offset = buffer.writeUInt32BE( this.siaddr, offset )
    offset = buffer.writeUInt32BE( this.giaddr, offset )

    // TODO: write chaddr, sname, file & options

    if( this.data ) {

    }

    return buffer

  }

}

Packet.MIN_SIZE = 236

Packet.Options = require( './options' )

module.exports = Packet
