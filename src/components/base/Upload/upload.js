import COS from 'cos-js-sdk-v5'

const config = {
  SecretId: 'AKIDcBdyYNJ2qRr7Y3GcdPyb3GMCEqCaL3ve',
  SecretKey: 'mDQRCwTfaaPNil9MZCaNySF06xidN02u',
  Bucket: 'test-1300263901',
  Region: 'ap-guangzhou'
}

let cos
/**
 * 处理文件上传的逻辑
 */
class Upload {
  cos = null; // cos实例
  init() {
    const { SecretId, SecretKey } = config
    if (cos) {
      cos = this.cos
      return
    }
    this.cos = new COS({
      SecretId,
      SecretKey
    })
    cos = this.cos
  }
  async upload(file, progressCb) {
    const Key = file.name
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: config.Bucket /* 必须 */,
          Region: config.Region /* 存储桶所在地域，必须字段 */,
          Key, /* 必须 */
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: progressCb
        },
        (err, data) => {
          if (err) {
            reject(err)
          }
          resolve({
            location: data.Location,
            Key
          })
        }
      )
    })
  }
  delete(Key) {
    return new Promise((resolve, reject) => {
      this.cos.deleteObject(
        {
          Bucket: config.Bucket /* 必须 */,
          Region: config.Region /* 存储桶所在地域，必须字段 */,
          Key /* 必须 */
        },
        function(err) {
          if (err) {
            reject(false)
          }
          resolve(true)
        }
      )
    })
  }
  download(Key) {
    return new Promise((resolve, reject) => {
      this.cos.getObjectUrl(
        {
          Bucket: config.Bucket /* 必须 */,
          Region: config.Region /* 存储桶所在地域，必须字段 */,
          Key /* 必须 */
        },
        function(err, data) {
          if (err) {
            reject(err)
          }
          resolve(data.Url)
        }
      )
    })
  }
}

export default new Upload()
