require('dotenv').config()
import AWS from 'aws-sdk'
import path from 'path'
import fs from 'fs'

//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SK
  });

// initialize s3
const s3 = new AWS.S3();
const ext = '.txt'


//need to put file in /data
export const aws_upload = (f,d) => {

  //configuring parameters
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Body : d,
    Key : "folder/"+Date.now()+"_"+f.name
  };

  return s3.upload(params, function (err, data) {
    //delete file from temp
    fs.unlink(f.tempFilePath, function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Temp File Delete');
    });

    //handle upload error
    if (err) {
      console.log("Error", err);
    }

    //success
    if (data) {
      console.log("Uploaded in:", data.Location);
    }
  });
}

export const aws_download = (res) => {
  const ext = '.mp3'
  const filePath = path.join('temp', 'x' + ext);

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: 'folder/1567163054411_s.mp3'
  };

  return s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body);

    //download
    res.download(filePath, function (err) {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        console.log(res.headersSent)
      } else {
        // decrement a download credit, etc. // here remove temp file
        fs.unlink(filePath, function (err) {
            if (err) {
                console.error(err);
            }
            console.log('Temp File Delete');
        });
      }
    })

    console.log(`${filePath} has been created!`);
  });
};
