
export const SERVER_PORT = 3008;

export const DB_URL = process.env.MONOGODB_URL ?? ''

export const PASSWORD_HASH_SALT_ROUNDS = 10;

export const JWT_SEC = process.env.JWT_SEC ?? 'asd'

export const WEBSOCKET_SERVER_PORT = 3009;