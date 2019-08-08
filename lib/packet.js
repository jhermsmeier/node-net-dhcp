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

  /**
   * Encode a DHCP packet into a buffer
   * @param {DHCP.Packet} value
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @returns {Buffer}
   */
  static encode( value, buffer, offset ) {

    offset = offset || 0

    var length = Packet.MIN_SIZE + offset
    length += value.data ? value.data.encodingLength() : 0

    buffer = buffer || Buffer.alloc( length )

    offset = buffer.writeUInt8( value.op, offset )
    offset = buffer.writeUInt8( value.htype, offset )
    offset = buffer.writeUInt8( value.hlen, offset )
    offset = buffer.writeUInt8( value.hops, offset )
    offset = buffer.writeUInt32BE( value.xid, offset )
    offset = buffer.writeUInt16BE( value.secs, offset )
    offset = buffer.writeUInt16BE( value.flags, offset )
    offset = buffer.writeUInt32BE( value.ciaddr, offset )
    offset = buffer.writeUInt32BE( value.yiaddr, offset )
    offset = buffer.writeUInt32BE( value.siaddr, offset )
    offset = buffer.writeUInt32BE( value.giaddr, offset )

    // TODO: write chaddr, sname, file & options

    if( value.data ) {
      Packet.Options.encode( value.data, buffer, offset )
    }

    return buffer

  }

  /**
   * Decode a DHCP packet from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @param {Number} [length]
   * @param {DHCP.Packet} [packet]
   * @returns {DHCP.Packet}
   */
  static decode( buffer, offset, length, packet ) {

    offset = offset || 0
    length = length || ( buffer.length - offset )
    packet = packet || new DHCP.Packet()

    if( ( buffer.length - offset ) < Packet.MIN_SIZE ) {
      throw new Error( `Packet too small, need at least ${Packet.MIN_SIZE} bytes` )
    }

    packet.op = buffer.readUInt8( offset + 0 )

    packet.htype = buffer.readUInt8( offset + 1 )
    packet.hlen = buffer.readUInt8( offset + 2 )
    packet.hops = buffer.readUInt8( offset + 3 )

    packet.xid = buffer.readUInt32BE( offset + 4 )

    packet.secs = buffer.readUInt16BE( offset + 8 )
    packet.flags = buffer.readUInt16BE( offset + 10 )

    packet.ciaddr = readIPv4( buffer, offset + 12 ) // buffer.readUInt32BE( offset + 12 )
    packet.yiaddr = readIPv4( buffer, offset + 16 ) // buffer.readUInt32BE( offset + 16 )
    packet.siaddr = readIPv4( buffer, offset + 20 ) // buffer.readUInt32BE( offset + 20 )
    packet.giaddr = readIPv4( buffer, offset + 24 ) // buffer.readUInt32BE( offset + 24 )

    // packet.chaddr = Buffer.alloc( packet.hlen ) // buffer.slice( offset + 28, offset + 44 )
    // buffer.copy( packet.chaddr, 0, offset + 28 )
    packet.chaddr = readHWAddr( buffer, offset + 28, packet.hlen )

    packet.sname = readASCII( buffer, offset + 44, 64 )
    packet.file = readASCII( buffer, offset + 108, 128 )

    if( offset + Packet.MIN_SIZE < buffer.length ) {
      packet.cookie = buffer.readUInt32BE( offset + Packet.MIN_SIZE )
      if( packet.cookie !== DHCP.OPTION_COOKIE ) {
        throw new Error( `Invalid DHCP option cookie; expected 0x${DHCP.OPTION_COOKIE.toString(16)}, got 0x${packet.cookie.toString(16)}` )
      }
      packet.data = new Packet.Options().parse( buffer, offset + 240 )
    } else {
      packet.cookie = null
      packet.data = null
    }

    return packet

  }

  parse( buffer, offset ) {
    return Packet.decode( buffer, offset, null, this )
  }

  write( buffer, offset ) {
    return Packet.encode( this, buffer, offset )
  }

}

Packet.MIN_SIZE = 236

Packet.Options = require( './options' )

module.exports = Packet
