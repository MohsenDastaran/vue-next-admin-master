export enum StorageKey {
  jwt = "jwt",
  preVoucher = "preVoucher",
  darkMode = "darkMode",
  "oauth2_ss::https://ui-dev.targoman.ir::1::DEFAULT::_ss_" = "oauth2_ss::https://ui-dev.targoman.ir::1::DEFAULT::_ss_",
  tablesData = "tablesData",
  multiPayment = "multiPayment"
}

export default {
  saveJson<T>(key: StorageKey, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getJson<T>(key: StorageKey): T | null {
    const value = localStorage.getItem(key)

    if (value !== null) {
      try {
        return JSON.parse(value) as T
      } catch (err) {
        return null
      }
    }

    return null
  },
  get(key: StorageKey): string | null {
    return localStorage.getItem(key)
  },
  save(key: StorageKey, value: string) {
    localStorage.setItem(key, value)
  },
  remove(key: StorageKey) {
    localStorage.removeItem(key)
  },
  wipeLocalStorage() {
    localStorage.clear()
  }
}
