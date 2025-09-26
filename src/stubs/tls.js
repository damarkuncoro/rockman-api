// Stub untuk tls module di client-side
// Mencegah error "Module not found" saat build

export const connect = () => ({
  on: () => {},
  write: () => {},
  end: () => {},
  removeListener: () => {}
})

const tlsStub = {
  connect
}

export default tlsStub