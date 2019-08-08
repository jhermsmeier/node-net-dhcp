var DHCP = require( './dhcp' )

var optionDefinitions = [
  // RFC 2132, Section 3. RFC 1497 Vendor Extensions
  { code:  1, name: 'subnetMask', type: 'IPv4' },
  { code:  2, name: 'timeOffset', type: 'Int32' },
  { code:  3, name: 'routers', type: 'IPv4List' },
  { code:  4, name: 'timeServers', type: 'IPv4List' },
  { code:  5, name: 'nameServers', type: 'IPv4List' },
  { code:  6, name: 'dnsServers', type: 'IPv4List' },
  { code:  7, name: 'logServers', type: 'IPv4List' },
  { code:  8, name: 'cookieServers', type: 'IPv4List' },
  { code:  9, name: 'lprServers', type: 'IPv4List' },
  { code: 10, name: 'impressServers', type: 'IPv4List' },
  { code: 11, name: 'resourceLocationServers', type: 'IPv4List' },
  { code: 12, name: 'hostname', type: 'String' },
  { code: 13, name: 'bootFileSize', type: 'String' },
  { code: 14, name: 'meritDumpFile', type: 'String' },
  { code: 15, name: 'domainName', type: 'String' },
  { code: 16, name: 'swapServer', type: 'IPv4' },
  { code: 17, name: 'rootPath', type: 'String' },
  { code: 18, name: 'extensionsPath', type: 'String' },
  // RFC 2132, Section 4. IP Layer Parameters per Host
  { code: 19, name: 'ipForwarding', type: 'Boolean' },
  { code: 20, name: 'nonLocalSourceRouting', type: 'Boolean' },
  { code: 21, name: 'policyFilter', type: 'IPv4List' },
  { code: 22, name: 'maximumDatagramReassemblySize', type: 'UInt16' },
  { code: 23, name: 'defaultAddressTTL', type: 'UInt8' },
  { code: 24, name: 'pathMTUAgingTimeout', type: 'UInt32' },
  { code: 25, name: 'pathMTUPlateauTable', type: 'UInt16Array' },
  // RFC 2132, Section 5. IP Layer Parameters per Interface
  { code: 26, name: 'interfaceMTU', type: 'UInt16' },
  { code: 27, name: 'allSubnetsAreLocal', type: 'Boolean' },
  { code: 28, name: 'broadcastAddress', type: 'IPv4' },
  { code: 29, name: 'performMaskDiscovery', type: 'Boolean' },
  { code: 30, name: 'maskSupplier', type: 'Boolean' },
  { code: 31, name: 'performRouterDiscovery', type: 'Boolean' },
  { code: 32, name: 'routerSolicitationAddress', type: 'IPv4' },
  { code: 33, name: 'staticRoute', type: 'IPv4List' },
  // RFC 2132, Section 6. Link Layer Parameters per Interface
  { code: 34, name: 'trailerEncapsulation', type: 'Boolean' },
  { code: 35, name: 'arpCacheTimeout', type: 'UInt32' },
  { code: 36, name: 'ethernetEncapsulation', type: 'Boolean' },
  // RFC 2132, Section 7. TCP Parameters
  { code: 37, name: 'tcpDefaultTTL', type: 'UInt8' },
  { code: 38, name: 'tcpKeepaliveInterval', type: 'UInt32' },
  { code: 39, name: 'tcpKeepaliveGarbage', type: 'Boolean' },
  // RFC 2132, Section 8. Application and Service Parameters
  { code: 40, name: 'nisDomain', type: 'String' },
  { code: 41, name: 'nisServers', type: 'IPv4List' },
  { code: 42, name: 'ntpServers', type: 'IPv4List' },
  { code: 43, name: 'vendorSpecificInformation', type: 'Buffer' },
  { code: 44, name: 'nbtNameServers', type: 'IPv4List' },
  { code: 45, name: 'nbtDatagramDistributionServers', type: 'IPv4List' },
  { code: 46, name: 'nbtNodeType', type: 'UInt8' },
  { code: 47, name: 'nbtScope', type: 'String' },
  { code: 48, name: 'x11FontServers', type: 'IPv4List' },
  { code: 49, name: 'x11DisplayManagers', type: 'IPv4List' },
  // RFC 2132, Section 9. DHCP Extensions
  { code: 50, name: 'requestedAddress', type: 'IPv4' },
  { code: 51, name: 'leaseTime', type: 'UInt32' },
  { code: 52, name: 'optionOverload', type: 'UInt8' },
  { code: 53, name: 'messageType', type: 'UInt8' },
  { code: 54, name: 'serverId', type: 'IPv4' },
  { code: 55, name: 'parameterRequestList', type: 'UInt8Array' },
  { code: 56, name: 'errorMessage', type: 'String' },
  { code: 57, name: 'messageMaxSize', type: 'UInt16' },
  { code: 58, name: 'renewalTime', type: 'UInt32' },
  { code: 59, name: 'rebindingTime', type: 'UInt32' },
  { code: 60, name: 'vendorClassId', type: 'String' },
  { code: 61, name: 'clientId', type: 'ClientID' },
  // RFC 2132, Section 8. Application and Service Parameters
  { code: 64, name: 'nisPlusDomain', type: 'String' },
  { code: 65, name: 'nisPlusServers', type: 'IPv4List' },
  // RFC 2132, Section 9. DHCP Extensions
  { code: 66, name: 'tftpServerName', type: 'String' },
  { code: 67, name: 'bootfileName', type: 'String' },
  // RFC 2132, Section 8. Application and Service Parameters
  { code: 68, name: 'mobileIpHomeAgents', type: 'IPv4List' },
  { code: 69, name: 'smtpServers', type: 'IPv4List' },
  { code: 70, name: 'pop3Servers', type: 'IPv4List' },
  { code: 71, name: 'nntpServers', type: 'IPv4List' },
  { code: 72, name: 'defaultWWWServers', type: 'IPv4List' },
  { code: 73, name: 'defaultFingerServers', type: 'IPv4List' },
  { code: 74, name: 'defaultIRCServers', type: 'IPv4List' },
  { code: 75, name: 'streetTalkServers', type: 'IPv4List' },
  { code: 76, name: 'stdaServers', type: 'IPv4List' },
  // TODO: 76-255
]

var optionCodes = new Map()
var optionTypes = new Map()

optionDefinitions.forEach(( option ) => {
  optionCodes.set( option.name, option.code )
  optionTypes.set( option.code, option.type )
})

function readString( buffer, offset, length, encoding = 'ascii' ) {
  var eod = buffer.indexOf( 0x00, offset )
  eod = Math.min( Math.max( eod, 0 ), offset + length )
  return buffer.toString( encoding, offset, eod )
}

function readIPv4( buffer, offset ) {
  var ip = ''
  ip += buffer[ offset + 0 ] + '.'
  ip += buffer[ offset + 1 ] + '.'
  ip += buffer[ offset + 2 ] + '.'
  ip += buffer[ offset + 3 ]
  return ip
}

function readIPv4List( buffer, offset, length ) {
  var list = []
  for( var i = 0; i < length; i += 4 ) {
    list.push( readIPv4( buffer, offset + i ) )
  }
  return list
}

function readUInt16Array( buffer, offset, length ) {
  var list = []
  for( var i = 0; i < length; i += 2 ) {
    list.push( buffer.readUInt16BE( offset + i ) )
  }
  return list
}

function readUInt8Array( buffer, offset, length ) {
  var list = []
  for( var i = 0; i < length; i += 1 ) {
    list.push( buffer.readUInt8( offset + i ) )
  }
  return list
}

function readBool( buffer, offset ) {
  return buffer[ offset ] == 1
}

class Options extends Map {

  constructor( ...argv ) {
    super( ...argv )
  }

  get( value ) {
    return super.get( value )
  }

  getOption( name ) {
    return super.get( optionCodes.get( name ) )
  }

  setOption( name, value ) {
    return super.set( optionCodes.get( name ), value )
  }

  static encode( options, buffer, offset ) {
    throw new Error( 'Not implemented' )
  }

  static decode( buffer, offset ) {
    throw new Error( 'Not implemented' )
  }

  encodingLength() {

    var length = 4

    for( var [ key, value ] of this ) {
      length += value.length
    }

    return length

  }

  parse( buffer, offset ) {

    offset = offset || 0

    var tag = 0
    var length = 0

    while( offset < buffer.length && buffer[ offset ] !== 0xFF ) {

      // Skip padding
      if( buffer[ offset ] === 0x00 ) {
        offset++
        continue
      }

      tag = buffer[ offset++ ]
      length = buffer[ offset++ ]

      switch( optionTypes.get( tag ) ) {
        case 'String': this.set( tag, buffer.toString( 'utf8', offset, offset + length ) ); break
        case 'Int8': this.set( tag, buffer.readInt8( offset ) ); break
        case 'Int16': this.set( tag, buffer.readInt16BE( offset ) ); break
        case 'Int32': this.set( tag, buffer.readInt32BE( offset ) ); break
        case 'UInt8': this.set( tag, buffer.readUInt8( offset ) ); break
        case 'UInt16': this.set( tag, buffer.readUInt16BE( offset ) ); break
        case 'UInt32': this.set( tag, buffer.readUInt32BE( offset ) ); break
        case 'UInt8Array': this.set( tag, readUInt8Array( buffer, offset, length ) ); break
        case 'UInt16Array': this.set( tag, readUInt16Array( buffer, offset, length ) ); break
        case 'IPv4': this.set( tag, readIPv4( buffer, offset ) ); break
        case 'IPv4List': this.set( tag, readIPv4List( buffer, offset, length ) ); break
        case 'Boolean': this.set( tag, readBool( buffer, offset ) ); break
        default:
          var slice = Buffer.alloc( length )
          buffer.copy( slice, 0, offset, offset + length )
          this.set( tag, slice )
          break
      }

      offset += length

    }

    return this

  }

}

module.exports = Options
