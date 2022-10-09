const BE_IP = process.env.REACT_APP_BE_IP || "localhost";

export const BE_URL = "http://"+BE_IP+":5000";

export const BE_WS_URL = "ws://"+BE_IP+":8999";