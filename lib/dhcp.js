var DHCP = module.exports

/**
 * DHCP Server port
 * @type {Number}
 * @constant
 */
DHCP.SERVER_PORT = 67

/**
 * DHCP Client port
 * @type {Number}
 * @constant
 */
DHCP.CLIENT_PORT = 68

/**
 * BOOTP message types
 * @enum {Number}
 */
DHCP.OP = {
  BOOTREQUEST: 1,
  BOOTREPLY: 2,
}

/**
 * BOOTP message flags
 * @enum {Number}
 */
DHCP.FLAG = {
  BROADCAST: 1 << 15,
}

/**
 * [INADDR description]
 * @type {Object}
 */
DHCP.INADDR = {
  ANY: '0.0.0.0',
  BROADCAST: '255.255.255.255',
}

/**
 * DHCP message types / op codes
 * @enum {Number}
 */
DHCP.MESSAGE = {
  DISCOVER: 1,
  OFFER: 2,
  REQUEST: 3,
  DECLINE: 4,
  ACK: 5,
  NAK: 6,
  RELEASE: 7,
  INFORM: 8,
}

/**
 * ARP Hardware Types
 * @enum {Number}
 */
DHCP.HTYPE = {
  ETHERNET: 1, // Ethernet (10Mb)
  EXPERIMENTAL_ETHERNET: 2, // Experimental Ethernet (3Mb)
  AX_25: 3, // Amateur Radio AX.25
  PRONET: 4, // Proteon ProNET Token Ring
  CHAOS: 5, // Chaos
  IEEE802: 6, // IEEE 802 Networks
  ARCNET: 7, // ARCNET
  HYPERCHANNEL: 8, // Hyperchannel
  LANSTAR: 9, // Lanstar
  AUTONET: 10, // Autonet Short Address
  LOCALTALK: 11, // LocalTalk
  LOCALNET: 12, // LocalNet (IBM PCNet or SYTEK LocalNET)
  ULTRA_LINK: 13, // Ultra link
  SMDS: 14, // SMDS
  FRAME_RELAY: 15, // Frame Relay
  ATM_1: 16, // Asynchronous Transmission Mode (ATM)
  HDLC: 17, // HDLC
  FIBRE: 18, // Fibre Channel
  ATM_2: 19, // Asynchronous Transmission Mode (ATM)
  SERIAL: 20, // Serial Line
  ATM_3: 21, // Asynchronous Transmission Mode (ATM)
}

/**
 * Magic number for message's option field
 * @type {Number}
 * @constant
 */
DHCP.OPTION_COOKIE = 0x63825363

/**
 * Values used to indicate that the DHCP 'sname' or 'file'
 * fields are being overloaded by using them to carry DHCP options
 * @enum {Number}
 */
DHCP.OPTION_OVERLOAD = {
  FILE: 1,
  SNAME: 2,
  BOTH: 3,
}

/**
 * DHCP Option Field Types
 * @enum {Number}
 * @constant
 */
DHCP.OPTION = {
  // Option padding (optional, for alignment)
  PAD: 0,
  // RFC 2132, 3. RFC 1497 Vendor Extensions
  SUBNET_MASK: 1,
  TIME_OFFSET: 2,
  ROUTER: 3,
  TIME_SERVER: 4,
  NAME_SERVER: 5,
  DOMAIN_NAME_SERVER: 6,
  LOG_SERVER: 7,
  COOKIE_SERVER: 8,
  LPR_SERVER: 9,
  IMPRESS_SERVER: 10,
  RESOURCE_LOCATION_SERVER: 11,
  HOST_NAME: 12,
  BOOT_FILE_SIZE: 13,
  MERIT_DUMP_FILE: 14,
  DOMAIN_NAME: 15,
  SWAP_SERVER: 16,
  ROOT_PATH: 17,
  EXTENSIONS_PATH: 18,
  // // RFC 2132, 4. IP Layer Parameters per Host
  // IP Forwarding
  // Non-Local Source Routing
  // Policy Filter
  // Maximum Datagram Reassembly Size
  // Default IP Time-to-live
  // Path MTU Aging Timeout
  // Path MTU Plateau Table
  // IP Layer Parameters per Interface
  // // RFC 2132, 5. IP Layer Parameters per Interface
  // Interface MTU
  // All Subnets are Local
  // Broadcast Address
  // Perform Mask Discovery
  // Mask Supplier
  // Perform Router Discovery
  // Router Solicitation Address
  // Static Route
  // // RFC 2132, 6. Link Layer Parameters per Interface
  // Trailer Encapsulation
  // ARP Cache Timeout
  // Ethernet Encapsulation
  // // RFC 2132, 7. TCP Parameters
  // TCP Default TTL
  // TCP Keepalive Interval
  // TCP Keepalive Garbage
  // // RFC 2132, Section 8. Application and Service Parameters
  // Network Information Service Domain
  // Network Information Servers
  // Network Time Protocol Servers
  // Vendor Specific Information
  // NetBIOS over TCP/IP Name Server
  // NetBIOS over TCP/IP Datagram Distribution Server
  // NetBIOS over TCP/IP Node Type
  // NetBIOS over TCP/IP Scope
  // X Window System Font Server
  // X Window System Display Manager
  // Network Information Service+ Domain
  // Network Information Service+ Servers
  // Mobile IP Home Agent
  // Simple Mail Transport Protocol (SMTP) Server
  // Post Office Protocol (POP3) Server
  // Network News Transport Protocol (NNTP) Server
  // Default World Wide Web (WWW) Server
  // Default Finger Server
  // Default Internet Relay Chat (IRC) Server
  // StreetTalk Server
  // StreetTalk Directory Assistance (STDA) Server
  // // RFC 2132, Section 9. DHCP Extensions
  // Requested IP Address
  // IP Address Lease Time
  // Option Overload
  // TFTP server name
  // Bootfile name
  // DHCP Message Type
  // Server Identifier
  // Parameter Request List
  // Message
  // Maximum DHCP Message Size
  // Renewal (T1) Time Value
  // Rebinding (T2) Time Value
  // Vendor class identifier
  // Client-Identifier
  // End-of-Options marker
  EOD: 255,
}

DHCP.Packet = require( './packet' )
DHCP.Client = require( './client' )
DHCP.Server = require( './server' )
