
import qiniu from 'qiniu'
import config from '../config'

//配置七牛云
qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KEY = config.qiniu.SK

const bucket = config.qiniu.bucket

const fetchImage = async (url, key) => new Promise((resolve, reject) => {
    let bash = `qshell fetch ${url} ${bucket} '${key}'`

    exec(bash, (code, stdout, stderr) => {
      if (stderr) return reject(stderr)
      if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)
  
      resolve(stdout)
    })
})

export default {
    fetchImage
  }