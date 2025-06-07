// import { S3BucketResource } from "@core/config";
import { IsNotEmpty, IsString } from "class-validator";

export class GetPreSignUrlS3Query {
  @IsNotEmpty()
  @IsString()
  file_name!: string;

  // @IsNotEmpty()
  // @IsEnum(S3BucketResource)
  // s3_bucket_resource!: S3BucketResource;
}
