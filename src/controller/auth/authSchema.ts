
export const login = {
  description: 'get login credential',
  tags: ['auth'],
  summary: 'login',
  body: {
    type: 'object',
    description: 'identity can be used for email / username',
    example: {
      identity: 'email / username',
      password: 'password'
    },
    required: ['identity', 'password'],
  },
  response: {
    200: {
      description: 'Success',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        value: {
          additionalProperties: true
        }
      },
    }
  },
}


