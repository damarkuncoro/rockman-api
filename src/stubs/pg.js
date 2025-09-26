// Stub untuk pg module di client-side
// Mencegah error "Module not found" saat build

export const Client = class {
  constructor() {}
  connect() { return Promise.resolve() }
  query() { return Promise.resolve({ rows: [] }) }
  end() { return Promise.resolve() }
}

export const Pool = class {
  constructor() {}
  connect() { return Promise.resolve() }
  query() { return Promise.resolve({ rows: [] }) }
  end() { return Promise.resolve() }
}

const pgStub = {
  Client,
  Pool
}

export default pgStub