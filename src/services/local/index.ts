import { createMMKV } from "react-native-mmkv";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ENCRYPTION_KEY, KEY_ID_STORE } from "@constants/local";

const LocalStorage = createMMKV({
  id: KEY_ID_STORE,
  encryptionKey: ENCRYPTION_KEY,
});

const LocalServices = {
  clear: async (): Promise<void> => {
    LocalStorage.clearAll();
  },
  setItem: async (key: string, value: string): Promise<void> => {
    LocalStorage.set(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    const value = LocalStorage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: async (key: string): Promise<void> => {
    LocalStorage.remove(key);
  },
};

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: LocalServices,
});

export default LocalServices;
