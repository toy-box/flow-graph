export const networkJson = {
  id: 'httpcall_1',
  name: '重新计算商品价格',
  description: '',
  callArguments: {
    method: 'POST',
    url: 'http://localhost:5141/goods/edit',
    contentType: 'application/json',
    pathParameters: {},
    queryParameters: {},
    cookies: {},
    headers: {},
    form: {
      name: '$goodsDto.name',
      goodsId: '$goodsDto.goodsId',
      price: '$goodsDto.price',
    },
    body: '$goodsDtoStr',
    authorization: {
      type: 'Basic',
      username: 'api',
      password: '',
      token: '',
    },
  },
  result: '$call_response',
}

export const networkJsonSchema = {
  $schema: 'https://json-schema.org/draft/2019-09/schema',
  $id: 'http://example.com/example.json',
  type: 'object',
  default: {},
  title: 'Root Schema',
  required: ['id', 'name', 'callArguments', 'result'],
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    callArguments: {
      type: 'object',
      default: {},
      title: 'The callArguments Schema',
      required: ['method', 'url', 'contentType'],
      properties: {
        method: {
          type: 'string',
          enum: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'HEAD',
            'OPTIONS',
            'PATCH',
            'CONNECT',
            'TRACE',
          ],
        },
        url: {
          type: 'string',
          pattern:
            '^(https?|ftp):\\/\\/(?:\\S+(?::\\S*)?@)?(?:[a-zA-Z0-9\\u00a1-\\uffff-]+|(?:\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\])|(?:\\[(?:[a-fA-F0-9]{1,4}:)*:[a-fA-F0-9]{1,4}\\]|(?:[a-zA-Z0-9-]+\\.)*[a-zA-Z0-9-]+\\.?))(?::\\d{2,5})?(?:[/?#][^\\s"]*)?$',
        },
        contentType: {
          type: 'string',
          enum: [
            'application/json',
            'application/xml',
            'application/octet-stream',
            'multipart/form-data',
            'application/x-www-form-urlencoded',
            'text/plain',
            'text/html',
            'image/jpeg',
            'image/png',
            'audio/mpeg',
            'video/mp4',
          ],
        },
        pathParameters: {
          anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'array' }],
        },
        queryParameters: {
          type: 'object',
        },
        cookies: {
          type: 'object',
        },
        headers: {
          type: 'object',
        },
        form: {
          type: 'object',
        },
        body: {
          anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'object' }],
        },
        authorization: {
          type: 'object',
          default: {},
          title: 'The Authorizetion Schema',
          properties: {
            type: {
              type: 'string',
            },
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    result: {
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object' },
        { type: 'array' },
      ],
    },
  },
  examples: [
    {
      id: 'httpcall_1',
      name: '重新计算商品价格',
      description: '',
      callArguments: {
        method: 'POST',
        url: 'http://localhost:5141/goods/edit',
        contentType: 'application/json',
        pathParameters: null,
        queryParameters: null,
        cookies: null,
        headers: null,
        form: {
          name: '$goodsDto.name',
          goodsId: '$goodsDto.goodsId',
          price: '$goodsDto.price',
        },
        body: '$goodsDtoStr',
        Authorizetion: {
          type: 'Basic',
          username: 'api',
          password: '',
          token: '',
        },
      },
      result: '$call_response',
    },
  ],
}
