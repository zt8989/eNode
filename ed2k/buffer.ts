import { TYPE_STRING, TYPE_UINT8, TYPE_UINT16, TYPE_UINT32, TAG_NAME, TAG_SIZE, TAG_SIZE_HI, TAG_TYPE, TAG_FORMAT, TAG_VERSION, TAG_PORT, TAG_SOURCES, TAG_MULEVERSION, TAG_FLAGS, TAG_RATING, TAG_MEDIA_ARTIST, TAG_MEDIA_ALBUM, TAG_MEDIA_TITLE, TAG_MEDIA_LENGTH, TAG_MEDIA_BITRATE, TAG_MEDIA_CODEC, TAG_SEARCHTREE, TAG_EMULE_UDPPORTS, TAG_EMULE_OPTIONS1, TAG_EMULE_OPTIONS2, VAL_PARTIAL_ID, VAL_PARTIAL_PORT, VAL_COMPLETE_ID, VAL_COMPLETE_PORT, TAG_IPV6, ED2K_Publishing } from "./op";
import { FileType } from "./bean/File";
import { TYPE_HASH } from "./op";

var log = require('tinylogger')
var conf = require('../enode.config')

Buffer.prototype._pointer = 0

Buffer.prototype.pos = function (pos?: number): any {
  if(typeof pos === "number"){
    this._pointer = pos
    if (this._pointer > this.length) { this._pointer = this.length }
    return this
  } else {
    return this._pointer
  }
}

Buffer.prototype.getUInt8 = function () {
  var r = this.readUInt8(this._pointer)
  this._pointer++
  return r
}

Buffer.prototype.putUInt8 = function (value) {
  this.writeUInt8(value, this._pointer)
  this._pointer++
  return this
}

Buffer.prototype.getUInt16LE = function () {
  var r = this.readUInt16LE(this._pointer)
  this._pointer += 2
  return r
}

Buffer.prototype.putUInt16LE = function (n) {
  this.writeUInt16LE(n, this._pointer)
  this._pointer += 2
  return this
}

Buffer.prototype.getUInt32LE = function () {
  var r = this.readUInt32LE(this._pointer)
  this._pointer += 4
  return r
}

Buffer.prototype.getUInt64LE = function () {
  var lo = this.readUInt32LE(this._pointer)
  var hi = this.readUInt32LE(this._pointer + 4)
  this._pointer += 8
  return lo + (hi * 0x100000000)
}

Buffer.prototype.putUInt32LE = function (value: number) {
  this.writeUInt32LE(value, this._pointer)
  this._pointer += 4
  return this
}

Buffer.prototype.getString = function (length?: number) {
  if (arguments.length == 0) { length = this.getUInt16LE() }
  return this.get(length).toString()
}

Buffer.prototype.putString = function (str) {
  var len = Buffer.byteLength(str)
  this.putUInt16LE(len)
  this.write(str, this._pointer)
  this._pointer += len
  return this
}

Buffer.prototype.putBuffer = function (buffer) {
  buffer.copy(this, this._pointer)
  this._pointer += buffer.length
  if (this._pointer > this.length) { this._pointer = this.length }
  return this
}

Buffer.prototype.putHash = function (hash: string | Buffer | ArrayBuffer) {
  if ((hash instanceof Buffer) && (hash.length == 16)) {
    this.putBuffer(hash)
  } else if(typeof hash === 'string' && (hash.length === 32)){
    this.putBuffer(Buffer.from(hash, 'hex'))
  } else if(hash instanceof ArrayBuffer){
    this.putBuffer(Buffer.from(hash))
  }
  else {
    log.error('putHash: Unsupported input. Type: ' + (typeof hash) )
  }
  return this
}

Buffer.prototype.get = function (len) {
  if (len == 0) return Buffer.alloc(0)
  if (len == undefined) {
    var r = this.slice(this._pointer, this.length)
    this._pointer = this.length
  }
  else {
    var end = this._pointer + len
    if (end > this.length) end = this.length
    var r = this.slice(this._pointer, end)
    this._pointer = end
  }
  r.pos(0)
  return r
}

// tags = array of array(type, code, data)

export const tagsLength = function (tags: any) {
  var len = 4   // tags count <u32>
  var tagsCount = tags.length
  for (var i = 0; i < tagsCount; i++) {
    len += 4   // tag header (t[0] type <u8>).(length <u16>).(t[1] code<u8>)
    var t = tags[i]
    //log.trace(t)
    switch (t[0]) {
      case TYPE_STRING:
        len += 2 + Buffer.byteLength(t[2])
        break
      case TYPE_UINT8:
        len += 1
        break
      case TYPE_UINT16:
        len += 2
        break
      case TYPE_UINT32:
        len += 4
        break
      default: log.error('Buffer.tagsLength: Unhandled tag type: 0x' + t[0].toString(16))
    }
  }
  return len
}

// tag = array(type, code, data)
Buffer.prototype.putTag = function (tag) {
  this.putUInt8(tag[0]).putUInt16LE(1).putUInt8(tag[1])   // (type).(length=1).(code)
  switch (tag[0]) { // data
    case TYPE_STRING:
      this.putString(tag[2])
      break
    case TYPE_UINT8:
      this.putUInt8(tag[2])
      break
    case TYPE_UINT16:
      this.putUInt16LE(tag[2])
      break
    case TYPE_UINT32:
      this.putUInt32LE(tag[2])
      break
    case TYPE_HASH:
      this.putHash(tag[2])
      break
    default: log.error('Buffer.putTag: Unhandled tag type: 0x' + tag[0].toString(16))
  }
}

Buffer.prototype.putTags = function (tags) {
  var count = tags.length
  this.putUInt32LE(count)
  for (var i = 0; i < count; i++) {
    this.putTag(tags[i])
  }
  return this
}

Buffer.prototype.getTagValue = function (type) {
  let value
  switch (type) {
    case TYPE_STRING:
      value = this.getString()
      break
    case TYPE_UINT8:
      value = this.getUInt8()
      break
    case TYPE_UINT16:
      value = this.getUInt16LE()
      break
    case TYPE_UINT32:
      value = this.getUInt32LE()
      break
    default:
      value = false
      log.error('Unknown tag type: 0x' + type.toString(16))
  }
  //log.trace('TAG: type: '+type+' value: '+value)
  return value
}

Buffer.prototype.getTag = function () {
  var type = this.getUInt8()
  if (type & 0x80) { // Lugdunum extended tag
    var code = this.getUInt8()
    type = (type & 0x7f)
    if (type >= 0x10) {
      var length = type - 0x10
      type = TYPE_STRING
      this.pos(this.pos() - 2)
      this.writeUInt16LE(length, this.pos())
    } // else handle it as a regular ed2k tag with given 'code' and 'type'
  }
  else {
    var length = this.getUInt16LE()
    if (length == 1) { // default ed2k tag
      var code = this.getUInt8()
    }
    else { // emule tag
      log.warn('Unhandled tag. Length: ' + length.toString(16))
      return false
    }
  }
  var tag: any = false
  switch (code) {
    case TAG_NAME:
      tag = ['name', this.getTagValue(type)]
      break
    case TAG_SIZE:
      tag = ['size', this.getTagValue(type)]
      break
    case TAG_SIZE_HI:
      tag = ['sizehi', this.getTagValue(type)]
      break
    case TAG_TYPE:
      tag = ['type', this.getTagValue(type)]
      break
    case TAG_FORMAT:
      tag = ['format', this.getTagValue(type)]
      break
    case TAG_VERSION:
      tag = ['version', this.getTagValue(type)]
      break
    case TAG_PORT:
      tag = ['port2', this.getTagValue(type)]
      break
    case TAG_SOURCES:
      tag = ['sources', this.getTagValue(type)]
      break
    case TAG_MULEVERSION:
      tag = ['muleversion', this.getTagValue(type)]
      break
    case TAG_FLAGS:
      tag = ['flags', this.getTagValue(type)]
      break
    case TAG_RATING:
      tag = ['rating', this.getTagValue(type)]
      break
    case TAG_MEDIA_ARTIST:
      tag = ['artist', this.getTagValue(type)]
      break
    case TAG_MEDIA_ALBUM:
      tag = ['album', this.getTagValue(type)]
      break
    case TAG_MEDIA_TITLE:
      tag = ['title', this.getTagValue(type)]
      break
    case TAG_MEDIA_LENGTH:
      tag = ['length', this.getTagValue(type)]
      break
    case TAG_MEDIA_BITRATE:
      tag = ['bitrate', this.getTagValue(type)]
      break
    case TAG_MEDIA_CODEC:
      tag = ['codec', this.getTagValue(type)]
      break
    case TAG_SEARCHTREE:
      tag = ['searchtree', this.getTagValue(type)]
      break
    case TAG_EMULE_UDPPORTS:
      tag = ['udpports', this.getTagValue(type)]
      break
    case TAG_EMULE_OPTIONS1:
      tag = ['options1', this.getTagValue(type)]
      break
    case TAG_EMULE_OPTIONS2:
      tag = ['options2', this.getTagValue(type)]
      break
    case TAG_IPV6:
      tag = ['ipv6', this.getTagValue(type)]
      break
    case ED2K_Publishing.CT_FILENAME:
      tag = ['filename', this.getTagValue(type)]
      break
    case ED2K_Publishing.CT_FILESIZE:
      tag = ['filesize', this.getTagValue(type)]
      break
    case ED2K_Publishing.CT_FILETYPE:
      tag = ['filetype', this.getTagValue(type)]
      break
    default:
      tag = [code, this.getTagValue(type)]
  }
  return tag
}

Buffer.prototype.getTags = function () {
  var count = this.getUInt32LE()
  var tags: any[] = []
  while (count--) {
    var tag = this.getTag()
    if (tag === false) return ['TAGERROR', true]
    tags.push(tag)
  }
  return tags
}

Buffer.prototype.getFileList = function (callback) {
  //log.debug('Buffer.getFileList')
  var count = this.getUInt32LE()
  for (var i = 0; i < count; i++) {
    var file: Partial<FileType> = {
      'hash': this.get(16),
      'complete': 1, // let's suppose it's completed by default
    }
    var id = this.getUInt32LE()
    var port = this.getUInt16LE()
    const tags = this.getTags()
    let name: any
    if(name = tags.find(x => x[0] === 'name')) {
      file.name = name[1]
    }
    let size: any
    if(size = tags.find(x => x[0] === 'size')) {
      file.size = BigInt(size[1])
    }
    let type: any
    if(type = tags.find(x => x[0] === 'type')) {
      file.type = type[1]
    }
    let sizehi: any
    if(sizehi = tags.find(x => x[0] === 'sizehi')) {
      file.sizehi = sizehi[1]
    }
    if ((id == VAL_PARTIAL_ID) && (port == VAL_PARTIAL_PORT)) {
      file.complete = 0
    }
    else if ((id == VAL_COMPLETE_ID) && (port == VAL_COMPLETE_PORT)) {
      file.complete = 1
    }
    if (file.sizehi && file.size) {
      file.size += BigInt(file.sizehi) * BigInt(0x100000000)
    }
    else file.sizehi = 0
    if (callback) callback(file)
  }
  return count
}

