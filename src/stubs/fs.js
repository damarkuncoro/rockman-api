// Stub untuk fs module di client-side
// Mencegah error "Module not found" saat build

export const readFileSync = () => ''
export const writeFileSync = () => {}
export const existsSync = () => false
export const mkdirSync = () => {}
export const readdirSync = () => []
export const statSync = () => ({ isDirectory: () => false, isFile: () => false })

const fsStub = {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync
}

export default fsStub