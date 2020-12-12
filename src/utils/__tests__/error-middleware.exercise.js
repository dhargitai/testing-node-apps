// Testing Middleware

// 🐨 you'll need both of these:
// import {UnauthorizedError} from 'express-jwt'
// import errorMiddleware from '../error-middleware'
import {UnauthorizedError} from 'express-jwt'
import {buildNext, buildReq, buildRes} from 'utils/generate'
import errorMiddleware from '../error-middleware'

// 🐨 Write a test for the UnauthorizedError case
// 💰 const error = new UnauthorizedError('some_error_code', {message: 'Some message'})
// 💰 const res = {json: jest.fn(() => res), status: jest.fn(() => res)}

describe('Testing error cases', () => {
  test('should response with 401 for express-jwt UnauthorizedError', () => {
    const errorCode = 401
    const errorMessage = 'some error message'
    const error = new UnauthorizedError(errorCode, errorMessage)
    const res = buildRes()
    const req = buildReq()
    const next = buildNext()

    errorMiddleware(error, req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      code: error.code,
      message: error.message,
    })
    expect(res.status).toHaveBeenCalledTimes(1)
  })

  test('should call next if response is already sent', () => {
    const error = 'some error'
    const req = buildReq()
    const res = buildRes({headersSent: true})
    const next = buildNext()

    errorMiddleware(error, req, res, next)
    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.json).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should return with 500 for unknown error', () => {
    const code = 500
    const message = 'some error message'
    const req = buildReq()
    const res = buildRes()
    const next = buildNext()
    const error = new Error(message)
    errorMiddleware(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(code)
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
      stack: error.stack,
    })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledTimes(1)
  })
})

// 🐨 Write a test for the headersSent case

// 🐨 Write a test for the else case (responds with a 500)
