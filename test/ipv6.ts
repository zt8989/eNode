import * as misc from '../ed2k/misc'
import ipaddr from 'ipaddr.js'

const ipv6 = "2408:8340:2a02:419:d804:4170:50e4:6c39"
const buffer = Buffer.from(ipaddr.parse(ipv6).toByteArray())
const bIpv6 = buffer.toString('binary')

const buffer2 = misc.IPv6BinaryStringToBuffer(bIpv6)

console.log('is two buffer equal', buffer.equals(buffer2))

const str = misc.IPv6StringToBinaryString(ipv6)
console.log('is two binary string equal', str === bIpv6)

console.log(str)