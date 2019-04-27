export const errorFunction = (message, code) => {
  const error = new Error();
  error.code = code;
  error.message = message;
  return error;
};