const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to send response
const respond = (request, response, content, type, status) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

// function to get index page
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

// function to get css for page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to get success page/info
const success = (request, response) => {
  // variable of content
  const content = {
    message: 'This is a successful response',
  };

  // checks if xml is the type, will reformat message
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 200);
  }

  // otherwise makes into json
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 200);
};

// function for bad request
const badRequest = (request, response) => {
  // variable for message
  const content = {
    message: 'This request has the required parameters',
  };

  // checks if xml is the type, will reformat message
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 400);
  }

  // checks valid query
  if (!request.query.valid || request.query.valid !== 'true') {
    content.message = 'Missing valid query parameter set to true';
    content.id = 'badRequest';

    const stringcontent = JSON.stringify(content);

    return respond(request, response, stringcontent, 'application/json', 400);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 200);
};

// function for unauthorized
const unauthorized = (request, response) => {
  // variable for message
  const content = {
    message: 'You have successfully viewed the content',
  };

  // checks if type is xml if so will format to it
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 401);
  }

  // checks if query is there
  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    content.message = 'Missing valid query parameter set to true';
    content.id = 'unauthorized';

    const stringcontent = JSON.stringify(content);
    return respond(request, response, stringcontent, 'application/json', 400);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 401);
};

// function for forbidden status
const forbidden = (request, response) => {
  // variable for message
  const content = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  // checks if type is for xml if it is will reformat
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 403);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 403);
};

// function for internal server error
const internal = (request, response) => {
  // variable for message
  const content = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  // checks if type is xml if it is will reformat for it
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 500);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 500);
};

// function for not implemented content
const notImplemented = (request, response) => {
  // variable for messages
  const content = {
    message: 'get request for this page has not been implemented yet. Check again later for updated content',
    id: 'notImplemented',
  };

  // checks if type is xml if so will reformatt it
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 501);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 501);
};

// function for any pages not found
const notFound = (request, response) => {
  // variable for messages
  const content = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  // if type is xml will reformat the content
  if (request.acceptedTypes === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, request.acceptedTypes, 404);
  }

  // stringify content
  const stringcontent = JSON.stringify(content);

  return respond(request, response, stringcontent, 'application/json', 404);
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
