import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('giNArbHRlWBDIggF')
const IV = CryptoJS.enc.Utf8.parse('jC34fOybW3zEh0Kl')

// 将WordArray转换为UTF-8字符串（处理中文字符）
function wordArrayToUtf8(wordArray) {
  const hex = wordArray.toString(CryptoJS.enc.Hex)
  let text = ''
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16)
    if (byte > 0) {
      text += String.fromCharCode(byte)
    }
  }
  // 使用decodeURIComponent处理UTF-8
  try {
    return decodeURIComponent(escape(text))
  } catch (e) {
    return text
  }
}

// 将UTF-8字符串转换为WordArray
function utf8ToWordArray(str) {
  const utf8str = unescape(encodeURIComponent(str))
  return CryptoJS.enc.Latin1.parse(utf8str)
}

export function decrypt(base64Cipher) {
  try {
    // 去除可能的BOM
    if (base64Cipher.charCodeAt(0) === 0xFEFF) {
      base64Cipher = base64Cipher.substring(1)
    }
    
    const decrypted = CryptoJS.AES.decrypt(base64Cipher, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    })
    
    let text = wordArrayToUtf8(decrypted)
    
    // 清理字符串：移除null字节和控制字符
    text = text.replace(/\0+$/, '')  // 移除尾部null字节
    text = text.replace(/[\x00-\x1F\x7F]/g, '')  // 移除控制字符
    
    // 只保留JSON内容（从第一个{到最后一个}）
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1)
    }
    
    return text
  } catch (e) {
    console.error('Decryption failed:', e)
    throw new Error('解密失败，请检查存档文件是否正确')
  }
}

export function encrypt(jsonString) {
  try {
    const wordArray = utf8ToWordArray(jsonString)
    const encrypted = CryptoJS.AES.encrypt(wordArray, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  } catch (e) {
    console.error('Encryption failed:', e)
    throw new Error('加密失败')
  }
}
