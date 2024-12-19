import { LocalStorageKey } from '@/typings/enums'

export const getItem = (key: LocalStorageKey) => localStorage.getItem(key)

export const setItem = (key: LocalStorageKey, val: string) => localStorage.setItem(key, val)

export const delItem = (key: LocalStorageKey) => localStorage.removeItem(key)
