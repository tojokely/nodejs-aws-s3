import express from 'express'
import fs from 'fs'
import path from 'path'
import fileUpload from'express-fileupload'
import { upload, download } from './index.controllers'

// declare app
const app = express()
// file upload middleware
app.use(fileUpload({
    useTempFiles : true,
    createParentPath: true
}));

// upload/dowloand using s3.upload()
app.post('/upload', upload)
app.get('/download', download)

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server started ...')
})
