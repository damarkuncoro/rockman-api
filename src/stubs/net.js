// Stub untuk net module di client-side
// Mencegah error "Module not found" saat build

export const Socket = class {
  constructor() {}
  connect() {}
  write() {}
  end() {}
  on() {}
  removeListener() {}
}

export const isIP = () => 0

const netStub = {
  Socket,
  isIP
}

export default netStub