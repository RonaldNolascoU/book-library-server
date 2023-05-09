import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

//initialize cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImage = async (file: any) => {
  try {
    const { createReadStream, filename } = await file

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
      createReadStream().pipe(stream)
    })
    return result?.secure_url
  } catch (e) {
    console.log({ e })
    //returns an error message on image upload failure.
    return `Image could not be uploaded:${e.message}`
  }
}
