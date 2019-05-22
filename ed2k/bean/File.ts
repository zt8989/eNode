export type FileType = {
  hash: string
  complete: number
  sizelo?: number
  sizehi?: number
  size: bigint
  name: string
  type: string
}