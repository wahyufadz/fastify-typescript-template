import {schemaResponse} from '../basicScema'

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
  },
  response:schemaResponse
}

export const register = {
  description: 'register user',
  tags: ['auth'],
  summary: 'register user',
  body: {
    type: 'object',
    example: {
      email: 'email',
      username: 'username',
      password: 'password',
      firstName: 'first name',
      lastName: 'last name',
    },
  },
  response:schemaResponse
}

export const refresh = {
  description: 'refresh token',
  tags: ['auth'],
  summary: 'refresh token',
  body: {
    type: 'object',
    example: {
      refreshToken: 'refresh Token',
    },
  },
  response:schemaResponse
}

export const logout = {
  description: 'logout user',
  tags: ['auth'],
  summary: 'logout user',
  body: {
    type: 'object',
    example: {
      refreshToken: 'refresh Token',
    },
  },
  response:schemaResponse
}

export const identity = {
  description: 'check registration username / email ',
  tags: ['auth'],
  summary: 'check registration username / email ',
  body: {
    type: 'object',
    example: {
      identity: 'username /email',
    },
  },
  response:schemaResponse
}
