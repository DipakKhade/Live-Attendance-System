
export const SERVER_CONFIG = {
    SERVER_PORT: 3008,
    DB_URL: process.env.MONOGODB_URL ?? '',
    PASSWORD_HASH_SALT_ROUNDS: 10,
    JWT_SEC: process.env.JWT_SEC ?? 'asd'
}