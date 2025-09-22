const http = require('http');

const responseHandler = require('./response.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/internal': responseHandler.internal,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/notImplemented': responseHandler.notImplemented,
  index: responseHandler.getIndex,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  request.query = Object.fromEntries(parsedUrl.searchParams);

  request.acceptedTypes = request.headers.accept;

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
