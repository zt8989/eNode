var hexy = require('hexy').hexy
import ipaddr from 'ipaddr.js'
import log from 'tinylogger'
import { PR_ED2K, PR_EMULE, PR_ZLIB } from './op';

/**
 * Prints an hexadecimal dump in console
 */
export const hexDump = function(data) {
  console.log(hexDump(data))
}

export const IPv6BinaryStringToString = function(str: string){
  return ipaddr.fromByteArray(BufferToBytesArray(IPv6BinaryStringToBuffer(str))).toString()
}

export const IPv6BufferToString = function(buffer: Buffer){
  return ipaddr.fromByteArray(BufferToBytesArray(buffer)).toString()
}

export const IPv6StringToBinaryString = function(str: string){
  return IPv6StringToBuffer(str).toString('binary')
}

export const IPv6StringToBuffer = function(str: string){
  return Buffer.from(ipaddr.parse(str).toByteArray())
}

export const IPv6BinaryStringToBuffer = function(str: string){
  return Buffer.from(str, 'binary')
}

export const BufferToBytesArray = function(buffer: Buffer){
  return Array.prototype.slice.call(buffer, 0)
}

export const IsValidIpv6 = function(str: string){
  return ipaddr.isValid(str)
}

/**
 * Get file extension
 *
 * @param {String} name Filename
 * @returns {String} Extension (without the dot)
 */
export const getExt = function(name: string) {
  if (!name || name.indexOf('.') === -1) return ''
  const ext = name.substring(name.lastIndexOf('.')+1, name.length).toLowerCase()
  if(ext.length > 8){
    return ''
  }
  return ext
}

export const hex = function(n, len) {
  n = (n*1).toString(16)
  while (n.length < len) n = '0' + n
  return n
}

export const IPv4toInt32LE = function(IPv4) {
  var ip = IPv4.split('.')
  ip = (ip[0]*1) + (ip[1]*0x100) + (ip[2]*0x10000) + (ip[3]*0x1000000)
  if (ip<0) log.error(ip)
  return ip
}

/**
 * Get file type based on file extension. The file type can be one on these:
 * 'video', 'audio', 'image', 'pro'.
 *
 * @param {String} name Filename
 * @returns {String} File type
 */
export const getFileType = function(name) {
  var extensions = {
    video:
      '3gp,aaf,asf,avchd,avi,fla,flv,m1v,m2v,m4v,mp4,mpg,mpe,mpeg,mov,mkv,mp4,'+
      'ogg,rm,svi'
      .split(','),
    audio:
      'aiff,au,wav,flac,la,pac,m4a,ape,rka,shn,tta,wv,wma,brstm,amr,mp2,mp3,'+
      'ogg,aac,m4a,mpc,ra,ots,vox,voc,mid,mod,s3m,xm,it,asf'
      .split(','),
    image:
      'cr2,pdn,pgm,pict,bmp,png,dib,djvu,gif,psd,pdd,icns,ico,rle,tga,jpeg,'+
      'jpg,tiff,tif,jp2,jps,mng,xbm,xcf,pcx'
      .split(','),
    pro:
      '7z,ace,arc,arj,bzip2,cab,gzip,rar,tar,zip,iso,nrg,img,adf,dmg,cue,bin,'+
      'cif,ccd,sub,raw'.split(','),
  }
  if (typeof name !== 'string') { return '' }
  var ext = getExt(name)
  if (extensions.video.indexOf(ext)>=0) return 'Video'
  if (extensions.audio.indexOf(ext)>=0) return 'Audio'
  if (extensions.image.indexOf(ext)>=0) return 'Image'
  if (extensions.pro  .indexOf(ext)>=0) return 'Pro'
  return ''
}

/**
 * Returns true if the given parameter is valid eD2K/eMule protocol number
 *
 * @param {Integer} protocol
 * @returns {Boolean}
 */
export const isProtocol = function(protocol) {
  return
    (protocol == PR_ED2K) ||
    (protocol == PR_EMULE) ||
    (protocol == PR_ZLIB)
}

export const isFunction = function(something) {
  return typeof(something) == 'function'
}

/**
 * Draws an ASCII box around some text
 */
export const box = function(text) {
  var l = text.length + 2
  var s = ''
  while (l--) s+= '-'
  s = '+'+s+'+'
  return s+'\n'+'| '+text+' |'+'\n'+s
}

/**
 * Returns a UNIX timestamp
 */
export const unixTimestamp = function() {
  return Math.round((new Date()).getTime()/1000)
}
