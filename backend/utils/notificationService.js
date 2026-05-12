import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Send SMS using Twilio
export const sendSMS = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) {
    console.warn('Twilio credentials not configured. Skipping SMS notification.');
    return { success: false, message: 'Twilio not configured' };
  }
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', from);
    params.append('Body', body);
    const response = await axios.post(url, params, {
      auth: { username: accountSid, password: authToken },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return { success: true, sid: response.data.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp using Twilio
export const sendWhatsApp = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!accountSid || !authToken || !from) {
    console.warn('Twilio WhatsApp credentials not configured. Skipping WhatsApp notification.');
    return { success: false, message: 'Twilio WhatsApp not configured' };
  }
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', `whatsapp:${to}`);
    params.append('From', `whatsapp:${from}`);
    params.append('Body', body);
    const response = await axios.post(url, params, {
      auth: { username: accountSid, password: authToken },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return { success: true, sid: response.data.sid };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return { success: false, error: error.message };
  }
};
