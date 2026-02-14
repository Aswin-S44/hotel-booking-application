const createResponse = (statusCode, message, data = null, error = null) => ({
  statusCode,
  success: statusCode >= 200 && statusCode < 300,
  message,
  data,
  error,
});

const successResponse = (data, message = "Success") =>
  createResponse(200, message, data);

const createdResponse = (data, message = "Resource Created") =>
  createResponse(201, message, data);

const badRequestResponse = (message = "Bad Request", error = null) =>
  createResponse(400, message, null, error);

const unauthorizedResponse = (message = "Unauthorized", error = null) =>
  createResponse(401, message, null, error);

const forbiddenResponse = (message = "Forbidden", error = null) =>
  createResponse(403, message, null, error);

const notFoundResponse = (message = "Not Found", error = null) =>
  createResponse(404, message, null, error);

const conflictResponse = (message = "Conflict", error = null) =>
  createResponse(409, message, null, error);

export {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
};
