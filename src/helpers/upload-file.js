import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

export const uploadFileHelper = (files, validExtensions = ['.png', '.jpg', 'jpeg', '.gif'], folder = '') => {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const { file } = files
    const ext = path.extname(file.name)

    if (!validExtensions.includes(ext)) {
      reject(new Error({
        msg: `The extension: ${ext} is not allowed. Allowed extensions: ${validExtensions}`
      }))
    }

    const tempName = uuidv4() + ext
    const uploadPath = path.join(__dirname, '../uploads', folder, tempName)

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }

      resolve(tempName)
    })
  })
}
