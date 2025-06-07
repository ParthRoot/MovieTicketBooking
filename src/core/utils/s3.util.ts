import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
// import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestException, Injectable } from "@nestjs/common";
import { getEnv, logger } from ".";
import { Credentials, S3 } from "aws-sdk";
@Injectable()
export class S3Util {
  private _bucket: string;
  private readonly ttl: string;
  private readonly _client: S3Client;
  private readonly _clients3: S3;

  constructor() {
    this._bucket = getEnv("AWS_S3_BUCKET_NAME");
    this.ttl = getEnv("AWS_S3_FILE_UPLOAD_TTL");
    this._client = this.s3Config();
    this._clients3 = this.s3ConfigSDK();
  }

  get client() {
    return this._client;
  }

  get bucket() {
    return this._bucket;
  }

  set bucket(bucketName: string) {
    this._bucket = bucketName;
  }

  private s3Config() {
    return new S3Client({
      credentials: {
        accessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
        secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
      },
      region: getEnv("AWS_REGION"),
    });
  }

  private s3ConfigSDK() {
    return new S3({
      credentials: new Credentials(
        getEnv("AWS_ACCESS_KEY_ID"),
        getEnv("AWS_SECRET_ACCESS_KEY")
      ),
      region: getEnv("AWS_REGION"),
      signatureVersion: "v4",
    });
  }

  async getPreSignedUploadRequestData(contentType: string, $key: string) {
    const proKey = $key.replace(`s3://${this._bucket}/`, "");
    const command = new PutObjectCommand({
      Bucket: this._bucket,
      Key: proKey,
      ContentType: contentType,
      ACL: "public-read",
    });
    const presignedUrl = await getSignedUrl(this._client, command, {
      expiresIn: parseInt(this.ttl),
    });
    return presignedUrl;
  }

  preSignUrl(
    fileKey: string,
    bucket: string,
    fileName?: string
  ): Promise<string> {
    const file = fileName ? `filename="${fileName}"` : "";
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey.replace(`s3://${bucket}/`, ""),
      ResponseContentDisposition: `attachment; ${file}`,
    });
    return getSignedUrl(this._client, command, { expiresIn: Number(this.ttl) });
  }

  getObjectPreSignUrl(fileKey: string) {
    const link = this.preSignUrl(fileKey, this._bucket);
    return link;
  }

  /**
   * It will delete the files from the s3 bucket
   * @param key string
   * @returns Promise<DeleteObjectCommandOutput>
   */
  public async deleteFile($key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this._bucket,
      Key: $key.replace(`s3://${this._bucket}/`, ""),
    });
    return new Promise((resolve, reject) => {
      this._client.send(command, (err, data) => {
        if (err) reject(err);
        resolve(data as DeleteObjectCommandOutput);
      });
    });
  }

  async deleteObjectByUrl(s3Url: string) {
    try {
      // Parse S3 URL to extract bucket name and object key
      const urlParts = s3Url.split("/");
      const bucketName = urlParts[2] ? urlParts[2].split(".")[0] : ""; // Extract bucket name from URL
      const objectKey = urlParts.slice(3).join("/"); // Extract object key from URL

      if (bucketName) {
        // Delete object
        await this._clients3
          .deleteObject({ Bucket: bucketName, Key: objectKey })
          .promise();
        console.log(`Deleted object ${objectKey} from bucket ${bucketName}`);
      }
    } catch (error: any) {
      console.error("Error deleting object:", error);
    }
  }

  public async getFileInfo(
    $key: string
  ): Promise<{ status: boolean; fileSize: number }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this._bucket,
        Key: $key.replace(`s3://${this._bucket}/`, ""),
      });
      const result = await this._client.send(command);
      return {
        status: true,
        fileSize: result.ContentLength as number,
      };
    } catch (e) {
      return {
        status: false,
        fileSize: 0,
      };
    }
  }

  /**
   * Read the file from bucket and returns the parsed json
   * @param key String
   * @returns Promise<GetObjectCommandOutput>
   */
  async readFile($key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: this._bucket,
      Key: $key.replace(`s3://${this._bucket}/`, ""),
    });
    return new Promise((resolve, reject) => {
      this._client.send(command, (err, data) => {
        if (err) {
          return reject(err);
        }

        if (!data?.Body) {
          return reject("Body is undefined");
        }

        return resolve(JSON.parse(data.Body.toString()));
      });
    });
  }

  public getDeaultProfilePic() {
    return `s3://${this._bucket}/default.png`;
  }

  public async uploadFile(
    file: any,
    fileName: string,
    folderPath: string
  ): Promise<string> {
    try {
      const key = `${folderPath}/${fileName}`;
      const bucket = this._bucket;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: "public-read",
        ContentType: file.mimetype,
      });
      await this._client.send(command);
      return `s3://${bucket}/${key}`;
    } catch (err) {
      logger.error(err, "s3 upload file error");
      throw err;
    }
  }
  /**
   * Function to fetch file buffer from S3 using an S3 URI
   * @param {string} s3Uri - The S3 URI (e.g., 's3://bucket-name/key')
   * @returns {Promise<Buffer>} - Returns a promise that resolves to the file buffer
   */
  async getFileBufferFromS3(s3Uri: string) {
    // Parse the S3 URI
    const match = s3Uri.match(/^s3:\/\/([^\/]+)\/(.+)$/);
    if (!match) {
      throw new BadRequestException("Invalid S3 URI");
    }
    const bucket = match[1];
    const key = match[2];

    // Fetch the object from S3
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this._client.send(command);

      // Convert the stream to a buffer
      const streamToBuffer = async (stream: any) => {
        return new Promise((resolve, reject) => {
          const chunks: any[] = [];
          stream.on("data", (chunk: any) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
      };

      const buffer = await streamToBuffer(data.Body);
      return buffer;
    } catch (error) {
      console.error("Error fetching the file from S3:", error);
      throw error;
    }
  }

  /**
   * get list of objects
   */

  public async listOfFiles(folder: string) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this._bucket,
        Delimiter: "/",
        Prefix: folder.replace(`s3://${this._bucket}/`, "") + "/",
      };
      const command = new ListObjectsCommand(params);

      this._client.send(command, (err, data) => {
        if (err) {
          reject(err);
        }

        if (!data?.Contents) {
          reject("Contents of this s3 folder are undefined.");
          return;
        }

        const list = data.Contents.map((obj) => obj.Key);

        if (!list) {
          reject("list is undefined.");
          return;
        }

        resolve(list);
      });
    });
  }
}
