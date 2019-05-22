type Tag = [string, number | string | Buffer | boolean];

interface Buffer {
  _pointer: number
  pos(): number
  pos(pos: number): Buffer
  getUInt8(): number
  putUInt8(value: number): Buffer
  getUInt16LE(): number
  putUInt16LE(value: number): Buffer
  getUInt32LE(): number
  putUInt32LE(value: number): Buffer
  getUInt64LE(): number
  getString(length?: number): string
  putString(str: string): Buffer
  putBuffer(buffer: Buffer): Buffer
  putHash(hash: Buffer): Buffer
  get(len?: number): any
  putTag(tag: any): any
  putTags(tags: any): any
  getTag(): Tag | false
  getTags(): Tag[]
  getFileList(callback: any): any
  getTagValue(type: any): any
}