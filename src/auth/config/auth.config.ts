import { registerAs } from "@nestjs/config";

export default registerAs ('auth', () => ({
    secret: process.env.JWT_TOKEN_SECRET,
    expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRESIN ?? '3600'),
    refreshTokenExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRESIN ?? '86400'),
}))