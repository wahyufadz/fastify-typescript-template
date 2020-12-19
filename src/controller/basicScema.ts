export const schemaResponse = {

    200: {
      description: 'Success',
      properties: {
        statusCode: { type: 'number'},
        message: { type: 'string' },
        value: {
          additionalProperties: true
        }
      },
      example:{
        statusCode:200,
        message:'Success'
      }
    },

    400: {
      description: 'Bad Request',
      properties: {
        statusCode: { type: 'number' },
        error: {type: 'string'},
        message: { type: 'string' },
        value: {
          additionalProperties: true
        }
      },
      example:{
        statusCode: 400,
        error: "Bad Request",
        message: "Fields is required"
      }
    },

    401: {
      description: 'Unauthorized',
      properties: {
        statusCode: { type: 'number' },
        error: {type: 'string'},
        message: { type: 'string' },
        value: {
          additionalProperties: true
        }
      },
      example:{
        statusCode: 401,
        error: "Unauthorized",
        message: "User not registered"
      }
    },

  }