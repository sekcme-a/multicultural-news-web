import { storage } from "firebase/firebase"

export const uploadImage = async (file, fileName) => {
  return new Promise(async function (resolve, reject) {
    try {
    const fileRef = storage.ref().child(fileName)
    await fileRef.put(file)
    const url = await fileRef.getDownloadURL()
    resolve(url)
    } catch (e) {
      reject(new Error(e.message))
    }
  })
}