// import {MMKV} from 'react-native-mmkv';

// export const getPrefsValue = key => {
//   const storage = new MMKV();
//   try {
//     const data = storage.getString(key);
//     if (data !== null) {
//       return data;
//     }
//   } catch (error) {
//     console.log('PREFS ERROR', error);
//   }
// };

// export const setPrefsValue = (key, value) => {
//   const storage = new MMKV();
//   try {
//     const data = storage.set(key, value);
//     if (data !== null) {
//       return data;
//     }
//   } catch (error) {
//     console.log('PREFS ERROR', error);
//   }
// };

// export const deleteAllPrefs = async () => {
//   const storage = new MMKV();
//   try {
//     storage.clearAll();
//   } catch (error) {
//     console.log('PREFS ERROR', error);
//   }
// };
