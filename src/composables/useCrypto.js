import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('giNArbHRlWBDIggF')
const IV = CryptoJS.enc.Utf8.parse('jC34fOybW3zEh0Kl')

let originalByteLen = 0

function wordArrayToUtf8(wordArray) {
  const hex = wordArray.toString(CryptoJS.enc.Hex)
  let text = ''
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16)
    if (byte > 0) {
      text += String.fromCharCode(byte)
    }
  }
  try {
    return decodeURIComponent(escape(text))
  } catch (e) {
    return text
  }
}

export function decrypt(base64Cipher) {
  try {
    if (base64Cipher.charCodeAt(0) === 0xFEFF) {
      base64Cipher = base64Cipher.substring(1)
    }

    const decrypted = CryptoJS.AES.decrypt(base64Cipher, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    })

    originalByteLen = decrypted.sigBytes

    let text = wordArrayToUtf8(decrypted)
    text = text.replace(/\0+$/, '')

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
    const jsonBytes = CryptoJS.enc.Utf8.parse(jsonString)
    const byteLen = jsonBytes.sigBytes

    const targetLen = Math.max(originalByteLen, Math.ceil(byteLen / 16) * 16)
    const padLen = targetLen - byteLen

    let paddedHex = jsonBytes.toString(CryptoJS.enc.Hex)
    for (let i = 0; i < padLen; i++) paddedHex += '00'
    const paddedWA = CryptoJS.enc.Hex.parse(paddedHex)

    const encrypted = CryptoJS.AES.encrypt(paddedWA, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    })
    return encrypted.toString()
  } catch (e) {
    console.error('Encryption failed:', e)
    throw new Error('加密失败')
  }
}
