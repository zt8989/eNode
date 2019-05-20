// Crypt Status
export const  CS_NONE        = 0
export const  CS_UNKNOWN     = 1
export const  CS_NEGOTIATING = 4
export const  CS_ENCRYPTING  = 5

// Encryption Methods
export const  EM_OBFUSCATE   = 0
export const  EM_PREFERRED   = EM_OBFUSCATE
export const  EM_SUPPORTED   = EM_OBFUSCATE

export const  CRYPT_PRIME_SIZE = 96
export const  CRYPT_DHA_SIZE   = 1

// PACKET
export const PS_NEW         = 1;
export const PS_READY       = 2;
export const PS_WAITING_DATA    = 3;
export const PS_CRYPT_NEGOTIATING = 4

// PROTOCOLS
export const PR_ED2K              = 0xe3;
export const PR_EMULE             = 0xc5;
export const PR_ZLIB              = 0xd4;

// OPCODES
export const OP_LOGINREQUEST      = 0x01;
export const OP_HELLO             = 0x01;
export const OP_HELLOANSWER       = 0x4c;
export const OP_SERVERMESSAGE     = 0x38;
export const OP_SERVERSTATUS      = 0x34;
export const OP_IDCHANGE          = 0x40;
export const OP_GETSERVERLIST     = 0x14;
export const OP_OFFERFILES        = 0x15;
export const OP_SERVERLIST        = 0x32;
export const OP_SERVERIDENT       = 0x41;
export const OP_GETSOURCES        = 0x19;
export const OP_FOUNDSOURCES      = 0x42;
export const OP_SEARCHREQUEST     = 0x16;
export const OP_SEARCHRESULT      = 0x33;
export const OP_CALLBACKREQUEST   = 0x1c;
export const OP_CALLBACKREQUESTED = 0x35;
export const OP_CALLBACKFAILED    = 0x36;
export const OP_GETSOURCES_OBFU   = 0x23;
export const OP_FOUNDSOURCES_OBFU = 0x44;

export const OP_GLOBSEARCHREQ3    = 0x90;
export const OP_GLOBSEARCHREQ2    = 0x92; //!! same as 3??
export const OP_GLOBGETSOURCES2   = 0x94;
export const OP_GLOBSERVSTATREQ   = 0x96;
export const OP_GLOBSERVSTATRES   = 0x97;
export const OP_GLOBSEARCHREQ     = 0x98;
export const OP_GLOBSEARCHRES     = 0x99;
export const OP_GLOBGETSOURCES    = 0x9a;
export const OP_GLOBFOUNDSOURCES  = 0x9b;
export const OP_SERVERDESCREQ     = 0xa2;
export const OP_SERVERDESCRES     = 0xa3;

export const TYPE_HASH            = 0x01;
export const TYPE_STRING          = 0x02;
export const TYPE_UINT32          = 0x03;
export const TYPE_FLOAT           = 0x04;
//TYPE_BOOL            = 0x05;
//TYPE_BOOLARR         = 0x06;
//TYPE_BLOB            = 0x07;
export const TYPE_UINT16          = 0x08;
export const TYPE_UINT8           = 0x09;
//TYPE_BSOB            = 0x0a;
export const TYPE_TAGS            = 0x0f;

export const TAG_NAME             = 0x01;
export const TAG_SIZE             = 0x02;
export const TAG_TYPE             = 0x03;
export const TAG_FORMAT           = 0x04;
export const TAG_VERSION          = 0x11;
export const TAG_VERSION2         = 0x91; // used in UDP OP_SERVERDESCRES
export const TAG_PORT             = 0x0f;
export const TAG_DESCRIPTION      = 0x0b;
export const TAG_DYNIP            = 0x85;
export const TAG_SOURCES          = 0x15;
export const TAG_COMPLETE_SOURCES = 0x30;
export const TAG_MULEVERSION      = 0xfb;
export const TAG_FLAGS            = 0x20;
export const TAG_RATING           = 0xF7;
export const TAG_SIZE_HI          = 0x3A;
export const TAG_SERVER_NAME      = 0x01;
export const TAG_SERVER_DESC      = 0x0b;
export const TAG_MEDIA_ARTIST     = 0xd0;
export const TAG_MEDIA_ALBUM      = 0xd1;
export const TAG_MEDIA_TITLE      = 0xd2;
export const TAG_MEDIA_LENGTH     = 0xd3;
export const TAG_MEDIA_BITRATE    = 0xd4;
export const TAG_MEDIA_CODEC      = 0xd5;
export const TAG_SEARCHTREE       = 0x0e;
export const TAG_EMULE_UDPPORTS   = 0xf9;
export const TAG_EMULE_OPTIONS1   = 0xfa;
export const TAG_EMULE_OPTIONS2   = 0xfe;
export const TAG_AUXPORTSLIST     = 0x93; // ???

// Constant values
export const VAL_PARTIAL_ID       = 0xfcfcfcfc;
export const VAL_PARTIAL_PORT     = 0xfcfc;
export const VAL_COMPLETE_ID      = 0xfbfbfbfb;
export const VAL_COMPLETE_PORT    = 0xfbfb;

// Flags
export const FLAG_ZLIB               = 0x0001;
export const FLAG_IPINLOGIN          = 0x0002;
export const FLAG_AUXPORT            = 0x0004;
export const FLAG_NEWTAGS            = 0x0008;
export const FLAG_UNICODE            = 0x0010;
export const FLAG_LARGEFILES         = 0x0100;
export const FLAG_SUPPORTCRYPT       = 0x0200;
export const FLAG_REQUESTCRYPT       = 0x0400;
export const FLAG_REQUIRECRYPT       = 0x0800;

export const FLAG_UDP_EXTGETSOURCES  = 0x0001;
export const FLAG_UDP_EXTGETFILES    = 0x0002;
export const FLAG_UDP_EXTGETSOURCES2 = 0x0020;
export const FLAG_UDP_OBFUSCATION    = 0x0200;
export const FLAG_TCP_OBFUSCATION    = 0x0400;

export const ENODE_VERSIONSTR        = 'v0.04';
export const ENODE_VERSIONINT        = 0x00000003;
export const ENODE_NAME              = 'eNode';