let cos_url = "https://cp-1304907527.cos.ap-nanjing.myqcloud.com/"
// let api_url = "http://127.0.0.1:8000/"
let api_url = "https://api-competition.seutools.com/"
// let api_url = "http://10.128.202.238:8000/"


let re_pattens = {
  card: /^[0-9]{9}$/,
  username: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/,
  password: /^.*$/,
  // password: /^[a-zA-Z0-9-*/+.~!@#$%^&()]{6,16}$/,
  phone: /^1[3-9][0-9]{9}$/,
  code: /^[0-9]{4}$/,
}

let validators = {
  card: [
    v => v.length === 9 || '请输入9位一卡通号',
    v => re_pattens.card.test(v) || "不能含有非法字符",
  ],
  username: [
    v => 16 >= v.length && v.length >= 1 || '长度在 1 到 16 个字符',
    v => re_pattens.username.test(v) || "不能含有非法字符",
  ],
  password: [
    // v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    // v => re_pattens.password.test(v) || "不能含有非法字符",
  ],
  confirm_password: password => [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
    v => password === v || "两次密码不一致"
  ],
  phone: [
    v => re_pattens.phone.test(v) || "请输入11位电话号码"
  ],
  code: [
    v => re_pattens.code.test(v) || "4位数验证码"
  ],
}
export {
  api_url
}

export default {
  cos_url,
  api_url,
  validators,
  re_pattens
}
