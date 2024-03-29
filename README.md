# DHCP
[![npm](https://flat.badgen.net/npm/v/net-dhcp)](https://npmjs.com/package/net-dhcp)
[![npm license](https://flat.badgen.net/npm/license/net-dhcp)](https://npmjs.com/package/net-dhcp)
[![npm downloads](https://flat.badgen.net/npm/dm/net-dhcp)](https://npmjs.com/package/net-dhcp)
[![build status](https://flat.badgen.net/travis/jhermsmeier/node-net-dhcp/master)](https://travis-ci.org/jhermsmeier/node-net-dhcp)

Dynamic Host Configuration Protocol (DHCP)

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save net-dhcp
```

----------

**NOTE:** This is still a work-in-progress; only message receipt and parsing is implemented at the time. The plan is to arrive at a fully functioning DHCP client & server implementation.

----------

## Examples

- `example/monitor`: Monitor the network for DHCP messages

## Usage

```js
var DHCP = require( 'net-dhcp' )
```

### Client

```js
var client = new DHCP.Client()

client.on( 'error', ( error ) => {
  console.log( error )
})

client.on( 'message', ( message, rinfo ) => {
  console.log( 'Message from', rinfo, message )
})

client.on( 'listening', ( socket ) => {
  console.log( 'Listening on', socket.address() )
})

client.listen()
```

### Server

```js
var server = new DHCP.Server()

server.on( 'error', ( error ) => {
  console.error( '[ERROR]', error )
})

// Warnings are emitted if a received packet could not be decoded
server.on( 'warning', ( error, rinfo, rawMessage ) => {
  console.error( '[WARN]', rinfo, error )
})

server.on( 'message', ( message, rinfo ) => {
  console.log( 'Client message from', rinfo, message )
})

server.on( 'listening', ( socket ) => {
  console.log( 'Server listening on', socket.address() )
})

server.listen()
```

## References

- [RFC 951 / BOOTSTRAP PROTOCOL (BOOTP)](https://tools.ietf.org/html/rfc951)
- [RFC 1542 / Clarifications and Extensions for the Bootstrap Protocol](https://tools.ietf.org/html/rfc1542)
- [RFC 2131 / Dynamic Host Configuration Protocol](https://tools.ietf.org/html/rfc2131)
- [RFC 2132 / DHCP Options and BOOTP Vendor Extensions](https://tools.ietf.org/html/rfc2132)
- [RFC 3046 / DHCP Relay Agent Information Option](https://tools.ietf.org/html/rfc3046)
- [RFC 3396 / Encoding Long Options in the Dynamic Host Configuration Protocol (DHCPv4)](https://tools.ietf.org/html/rfc3396)
- [RFC 3397 / Dynamic Host Configuration Protocol (DHCP) Domain Search Option](https://tools.ietf.org/html/rfc3397)
- [RFC 4436 / Detecting Network Attachment in IPv4 (DNAv4)](https://tools.ietf.org/html/rfc4436)
- [RFC 6607 / Virtual Subnet Selection Options for DHCPv4 and DHCPv6](https://tools.ietf.org/html/rfc6607)
- [RFC 6842 / Client Identifier Option in DHCP Server Replies](https://tools.ietf.org/html/rfc6842)
- [RFC 8415 / Dynamic Host Configuration Protocol for IPv6 (DHCPv6)](https://tools.ietf.org/html/rfc8415)
