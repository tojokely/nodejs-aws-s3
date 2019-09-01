import {aws_download, aws_upload} from './aws'
import fs from 'fs'
import path from 'path'

export const upload = (req, res) => {
  try {
    // if there is no file
    if(!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file = req.files.file;

      //read file and upload data (stream)
      fs.readFile(file.tempFilePath, function(err,data) {
        if (err) throw err; // Something went wrong!
        aws_upload(file,data)
      })

      //send response
      res.send({
          status: true,
          message: 'File is uploaded',
          data: {
              name: file.name,
              mimetype: file.mimetype,
              size: file.size
          }
      });
    }
  } catch(e) {
    console.error(e)
    res.status(500).end()
  }
}

export const download = async (req, res) => {
  try {
    // download filepath
    aws_download(res)
    const fileLocation = path.join('temp', 'x.mp3');
  } catch(e) {
    console.error(e)
    res.status(400).end()
  }
}
