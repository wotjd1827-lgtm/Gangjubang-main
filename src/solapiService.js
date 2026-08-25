/**
 * Solapi Messaging Service for Gangjubang
 * Integrates Solapi API (SMS, LMS, Kakao Alimtalk)
 * Production-ready Universal Module (Node.js & Browser support)
 */

const SOLAPI_API_KEY = import.meta.env.VITE_SOLAPI_API_KEY || 'NCSBUKHHTID7ZZAL';
const SOLAPI_API_SECRET = import.meta.env.VITE_SOLAPI_API_SECRET || 'WL5MWQVCCF13FDSNU31N70YAT3JQSNS2';
const DEFAULT_SENDER = import.meta.env.VITE_SOLAPI_SENDER_NUMBER || '01033329155';

/**
 * Universal Authorization Header Generator for Solapi (HMAC-SHA256)
 */
export async function generateAuthHeader(apiKey = SOLAPI_API_KEY, apiSecret = SOLAPI_API_SECRET) {
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 12);
  const data = date + salt;

  if (!apiSecret) {
    return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}`;
  }

  try {
    // 1. Browser Web Crypto API
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(apiSecret);
      const msgData = encoder.encode(data);

      const cryptoKey = await window.crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      );

      const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signatureHex}`;
    }

    // 2. Node.js environment fallback
    const nodeCrypto = await import('crypto');
    const signatureHex = nodeCrypto.createHmac('sha256', apiSecret).update(data).digest('hex');
    return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signatureHex}`;
  } catch (err) {
    console.error('Solapi signature generation error:', err);
    return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}`;
  }
}

/**
 * Send Single SMS / LMS via Solapi
 */
export async function sendSolapiSms({ to, text, subject = '', sender = DEFAULT_SENDER }) {
  if (!to || !text) {
    return { success: false, message: '수신자 번호(to)와 메시지 본문(text)은 필수입니다.' };
  }

  const cleanTo = String(to).replace(/[^0-9]/g, '');
  const cleanFrom = String(sender).replace(/[^0-9]/g, '');

  if (cleanTo.length < 10) {
    return { success: false, message: '유효한 전화번호 형식이 아닙니다.' };
  }

  try {
    const authHeader = await generateAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);

    const payload = {
      message: {
        to: cleanTo,
        from: cleanFrom,
        text: text,
        subject: subject || (text.length > 90 ? '[강주방]' : undefined)
      }
    };

    const res = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      return { success: true, data: result };
    } else {
      console.warn('[Solapi 발송 응답]:', result);
      return { success: false, message: result.errorMessage || 'Solapi 발송 실패', error: result };
    }
  } catch (err) {
    console.error('[Solapi 네트워크 에러]:', err);
    return { success: false, message: err.message, error: err };
  }
}

/**
 * Send Kakao Alimtalk Notification via Solapi
 */
export async function sendSolapiKakaoAlimtalk({ to, templateId, pfId, variables = {}, sender = DEFAULT_SENDER }) {
  if (!to || !templateId || !pfId) {
    return { success: false, message: '수신번호(to), 템플릿ID(templateId), 카카오PFID(pfId)는 필수입니다.' };
  }

  const cleanTo = String(to).replace(/[^0-9]/g, '');
  const cleanFrom = String(sender).replace(/[^0-9]/g, '');

  try {
    const authHeader = await generateAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);

    const payload = {
      message: {
        to: cleanTo,
        from: cleanFrom,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          variables: variables
        }
      }
    };

    const res = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (err) {
    console.error('[Solapi 알림톡 에러]:', err);
    return { success: false, message: err.message, error: err };
  }
}

/**
 * Send Batch SMS to Multiple Recipients
 */
export async function sendBatchSolapiSms({ recipients = [], text, sender = DEFAULT_SENDER }) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return { success: false, message: '수신자 목록이 비어있습니다.' };
  }

  const cleanFrom = String(sender).replace(/[^0-9]/g, '');
  const messages = recipients.map(r => ({
    to: String(typeof r === 'string' ? r : r.phone).replace(/[^0-9]/g, ''),
    from: cleanFrom,
    text: typeof r === 'object' && r.text ? r.text : text
  }));

  try {
    const authHeader = await generateAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);

    const res = await fetch('https://api.solapi.com/messages/v4/send-many', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ messages })
    });

    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (err) {
    console.error('[Solapi 대량 발송 에러]:', err);
    return { success: false, message: err.message, error: err };
  }
}
