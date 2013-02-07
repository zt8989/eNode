// PROTOCOLS
global.PR_ED2K             = 0xe3;
global.PR_EMULE            = 0xc5;
global.PR_ZLIB             = 0xd4;

// OPCODES
global.OP_LOGINREQUEST     = 0x01;
global.OP_SERVERMESSAGE    = 0x38;
global.OP_SERVERSTATUS     = 0x34;
global.OP_IDCHANGE         = 0x40;
global.OP_GETSERVERLIST    = 0x14;
global.OP_OFFERFILES       = 0x15;
global.OP_SERVERLIST       = 0x32;
global.OP_SERVERIDENT      = 0x41;
global.OP_GETSOURCES       = 0x19;
global.OP_FOUNDSOURCES     = 0x42;
global.OP_SEARCHREQUEST    = 0x16;
global.OP_SEARCHRESULT     = 0x33;
global.OP_CALLBACKREQUEST  = 0x1c;
global.OP_CALLBACKREQUESTED= 0x35;
global.OP_CALLBACKFAILED   = 0x36;

global.OP_GLOBGETSOURCES   = 0x9a;
global.OP_GLOBGETSOURCES2  = 0x94;
global.OP_GLOBFOUNDSOURCES = 0x9b;
global.OP_GLOBSERVSTATREQ  = 0x96;
global.OP_GLOBSERVSTATRES  = 0x97;
global.OP_GLOBSEARCHREQ    = 0x98; //!!
global.OP_GLOBSEARCHREQ2   = 0x92; //!!
global.OP_GLOBSEARCHREQ3   = 0x90; //!!
global.OP_GLOBSEARCHRES    = 0x99; //!!
global.OP_SERVERDESCREQ    = 0xa2;
global.OP_SERVERDESCRES    = 0xa3;

global.TYPE_HASH           = 0x01; // unsupported, 16 bytes
global.TYPE_STRING         = 0x02; // [u16]len[len]data
global.TYPE_UINT32         = 0x03; // 4 bytes
global.TYPE_FLOAT          = 0x04; // 4 bytes
//global.TYPE_BOOL           = 0x05; // unsupported, 1 byte
//global.TYPE_BOOLARR        = 0x06; // unsupported, [u16]len[len]data
//global.TYPE_BLOB           = 0x07; // unsupported, [u16]len[len]data
global.TYPE_UINT16         = 0x08; // 2 bytes
global.TYPE_UINT8          = 0x09; // 1 byte
//global.TYPE_BSOB           = 0x0a; // unsupported, [u16]len[len]data
global.TYPE_TAGS           = 0x0f; // 1 byte

global.TAG_NAME            = 0x01; // <string>NAME
global.TAG_SIZE            = 0x02; // <u32><u32>
global.TAG_TYPE            = 0x03; // <str>
global.TAG_FORMAT          = 0x04;
global.TAG_VERSION         = 0x11; // <u8>0x3c
global.TAG_VERSION2        = 0x91;
global.TAG_PORT            = 0x0f; // <u16>port
global.TAG_DESCRIPTION     = 0x0b;
global.TAG_DYNIP           = 0x85;
global.TAG_SOURCES         = 0x15;
global.TAG_COMPLETE_SOURCES= 0x30;
global.TAG_MULEVERSION     = 0xfb; // <u32>ver
global.TAG_FLAGS           = 0x20; // <u8>flags
global.TAG_RATING          = 0xF7; // <u8>
global.TAG_SIZE_HI         = 0x3A; // <u32>
global.TAG_SERVER_NAME     = 0x01; // <string>name
global.TAG_SERVER_DESC     = 0x0b; // <string>desc
global.TAG_MEDIA_ARTIST    = 0xd0; // <str>
global.TAG_MEDIA_ALBUM     = 0xd1; // <str>
global.TAG_MEDIA_TITLE     = 0xd2; // <str>
global.TAG_MEDIA_LENGTH    = 0xd3; //
global.TAG_MEDIA_BITRATE   = 0xd4; //
global.TAG_MEDIA_CODEC     = 0xd5; //

global.FL_PARTIAL_ID       = 0xfcfcfcfc;
global.FL_PARTIAL_PORT     = 0xfcfc;
global.FL_COMPLETE_ID      = 0xfbfbfbfb;
global.FL_COMPLETE_PORT    = 0xfbfb;

global.FLAG_ZLIB           = 0x0001;
global.FLAG_IPINLOGIN      = 0x0002;
global.FLAG_AUXPORT        = 0x0004;
global.FLAG_NEWTAGS        = 0x0008;
global.FLAG_UNICODE        = 0x0010;
global.FLAG_LARGEFILES     = 0x0100;
global.FLAG_SUPPORTCRYPT   = 0x0200;
global.FLAG_REQUESTCRYPT   = 0x0400;
global.FLAG_REQUIRECRYPT   = 0x0800;

global.FLAG_UDP_GETSOURCES      = 0x0001;
global.FLAG_UDP_GETFILES        = 0x0002;
global.FLAG_UDP_GLOBGETSOURCES2 = 0x0020;
global.FLAG_UDP_OBFUSCATION     = 0x0200;
global.FLAG_TCP_OBFUSCATION    = 0x0400;

global.ENODE_VERSIONSTR         = 'v0.01a';
global.ENODE_VERSIONINT         = 0x00000001;
global.ENODE_NAME               = 'eNode';

console.log('+---------------+');
console.log('| '+ENODE_NAME+' '+ENODE_VERSIONSTR+' |');
console.log('+---------------+');
