const otpStorage = new Map<string, { otp: string; expires: Date }>();

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOtp(email: string, otp: string) {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 5);
  otpStorage.set(email, { otp, expires });
}

export function verifyStoredOtp(email: string, otp: string) {
  const storedOtp = otpStorage.get(email);

  if (!storedOtp) {
    return false;
  }

  if (new Date() > storedOtp.expires) {
    otpStorage.delete(email);
    return false;
  }

  if (storedOtp.otp !== otp) {
    return false;
  }

  otpStorage.delete(email);
  return true;
}
