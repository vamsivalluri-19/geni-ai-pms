import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
const router = express.Router();

// Placeholder: Replace with real OAuth logic and passport/simple-oauth2 if needed

const normalizeUrl = (url) => (url || '').trim().replace(/\/+$/, '');

const getBackendBaseUrl = (req) => {
  const configured = normalizeUrl(process.env.BACKEND_URL);
  if (configured) {
    return configured;
  }

  const forwardedProto = (req.headers['x-forwarded-proto'] || '').toString().split(',')[0].trim();
  const protocol = forwardedProto || req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const frontendBaseUrl = normalizeUrl(process.env.FRONTEND_URL) || 'http://localhost:5173';

const requireEnv = (key, res) => {
  const value = process.env[key];
  if (!value) {
    res.status(500).json({
      success: false,
      message: `${key} is not configured on server`
    });
    return null;
  }
  return value;
};

const redirectWithOauthError = (res, frontendBaseUrl, code, detail) => {
  const params = new URLSearchParams({ oauth_error: code });
  if (detail) {
    params.set('oauth_error_detail', detail.slice(0, 500));
  }
  return res.redirect(`${frontendBaseUrl}/?${params.toString()}`);
};

const generateToken = (id, role) =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

const getOrCreateOAuthUser = async ({ email, name, provider, providerId, avatar }) => {
  let user = await User.findOne({ email });

  if (user) {
    if (!user.oauthProviders) {
      user.oauthProviders = {};
    }
    user.oauthProviders[provider] = providerId;
    if (avatar && !user.avatar) {
      user.avatar = avatar;
    }
    await user.save();
    return user;
  }

  user = await User.create({
    name,
    email,
    password: `oauth_${provider}_${providerId}`,
    role: 'student',
    avatar,
    oauthProviders: {
      [provider]: providerId
    },
    otpVerified: true
  });

  await Student.create({
    user: user._id,
    rollNumber: `AUTO-${user._id.toString().slice(-6)}`,
    branch: 'CSE',
    cgpa: 0,
    phoneNumber: '',
    skills: [],
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  });

  return user;
};

// Google OAuth Redirect
router.get('/google', (req, res) => {
  // Redirect to Google OAuth consent screen
  const clientId = requireEnv('GOOGLE_CLIENT_ID', res);
  if (!clientId) return;

  const backendBaseUrl = getBackendBaseUrl(req);
  const redirectUri = encodeURIComponent(`${backendBaseUrl}/api/auth/google/callback`);
  const scope = encodeURIComponent('profile email');
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`);
});

// Google OAuth Callback
router.get('/google/callback', (req, res) => {
  (async () => {
    try {
      const clientId = requireEnv('GOOGLE_CLIENT_ID', res);
      const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET', res);
      if (!clientId || !clientSecret) return;

      const { code } = req.query;
      if (!code) {
        return redirectWithOauthError(res, frontendBaseUrl, 'missing_code', 'No authorization code received from Google');
      }

      const backendBaseUrl = getBackendBaseUrl(req);
      const redirectUri = `${backendBaseUrl}/api/auth/google/callback`;

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code: String(code),
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        let tokenErrorDetail = `token_status_${tokenResponse.status}`;
        try {
          const tokenErrorBody = await tokenResponse.text();
          if (tokenErrorBody) {
            tokenErrorDetail = tokenErrorBody;
          }
        } catch (_error) {
          // ignore parse issues and keep status fallback
        }
        return redirectWithOauthError(res, frontendBaseUrl, 'token_exchange_failed', tokenErrorDetail);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        return redirectWithOauthError(res, frontendBaseUrl, 'missing_access_token', 'Google token response did not include access_token');
      }

      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!profileResponse.ok) {
        let profileErrorDetail = `profile_status_${profileResponse.status}`;
        try {
          const profileErrorBody = await profileResponse.text();
          if (profileErrorBody) {
            profileErrorDetail = profileErrorBody;
          }
        } catch (_error) {
          // ignore parse issues and keep status fallback
        }
        return redirectWithOauthError(res, frontendBaseUrl, 'profile_fetch_failed', profileErrorDetail);
      }

      const profile = await profileResponse.json();
      const email = profile.email;
      const name = profile.name || profile.email;
      const googleId = profile.id;
      const avatar = profile.picture;

      if (!email || !googleId) {
        return redirectWithOauthError(res, frontendBaseUrl, 'invalid_profile', 'Google profile is missing email or id');
      }

      const user = await getOrCreateOAuthUser({
        email,
        name,
        provider: 'google',
        providerId: googleId,
        avatar
      });

      const appToken = generateToken(user._id, user.role);
      const safeUser = {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };

      const userParam = encodeURIComponent(JSON.stringify(safeUser));
      return res.redirect(`${frontendBaseUrl}/?oauth=google&token=${encodeURIComponent(appToken)}&user=${userParam}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return redirectWithOauthError(res, frontendBaseUrl, 'google_callback_failed', error?.message || 'Unknown callback error');
    }
  })();
});

// GitHub OAuth Redirect
router.get('/github', (req, res) => {
  const clientId = requireEnv('GITHUB_CLIENT_ID', res);
  if (!clientId) return;

  const redirectUri = encodeURIComponent(`${backendBaseUrl}/api/auth/github/callback`);
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`);
});

// GitHub OAuth Callback
router.get('/github/callback', (req, res) => {
  res.redirect(`${frontendBaseUrl}?oauth=github`);
});

// LinkedIn OAuth Redirect
router.get('/linkedin', (req, res) => {
  const clientId = requireEnv('LINKEDIN_CLIENT_ID', res);
  if (!clientId) return;

  const redirectUri = encodeURIComponent(`${backendBaseUrl}/api/auth/linkedin/callback`);
  const scope = encodeURIComponent('r_liteprofile r_emailaddress');
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
});

// LinkedIn OAuth Callback
router.get('/linkedin/callback', (req, res) => {
  res.redirect(`${frontendBaseUrl}?oauth=linkedin`);
});

export default router;
