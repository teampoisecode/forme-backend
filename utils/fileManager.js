const env = process.env;
const AWS = require("aws-sdk");

const AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET_NAME = env.AWS_S3_BUCKET_NAME;
const AWS_S3_REGION = env.AWS_S3_REGION;
const AWS_FOLDER = env.AWS_FOLDER;

let s3config = {
  region: AWS_S3_REGION,
};

if (AWS_ACCESS_KEY_ID) {
  s3config = {
    ...s3config,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  };
}

class FileManager {
  s3;

  constructor() {
    this.s3 = new AWS.S3(s3config);
  }

  async uploadFile(key, fileData) {
    try {
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: `${AWS_FOLDER}/${key}`,
        Body: fileData,
      };
      this.s3.upload(params, function (err, data) {
        console.info(err, data);
      });
    } catch (e) {
      console.err("Error uploading file" + e.message);
    }
  }

  deleteFile(key) {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
    };
    return this.s3.deleteObject(params);
  }

  async getFileByKey(key, contentDisposition, contentType) {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: contentDisposition,
      ResponseContentType: contentType,
    };

    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) {
          console.err(err, err.stack);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  generatePresignedUrl(
    fileKey,
    contentDisposition,
    contentType,
    expiryTime = 3600
  ) {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: expiryTime,
      ResponseContentDisposition: contentDisposition,
      ResponseContentType: contentType,
    };
    return this.s3.getSignedUrl("getObject", params);
  }

  streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
}

module.exports = FileManager;
