import transform from './transform'
import errorBoundary from './errorBoundary'
import evalCode from './evalCode'

export const generateElement = (
  { code = '', scope = {}, compileOptions },
  errorCallback
) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, '')

  // NOTE: Workaround for classes and arrow functions.
  const transformed = transform(`(${codeTrimmed})`, compileOptions).trim()

  return errorBoundary(
    evalCode(
      `return ${transformed}`,
      scope
    ),
    errorCallback
  )
}

export const renderElementAsync = (
  { code = '', scope = {}, compileOptions },
  resultCallback,
  errorCallback
) => {
  const render = element => {
    resultCallback(
      errorBoundary(
        element,
        errorCallback
      )
    )
  }

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError('No-Inline evaluations must call `render`.')
    )
  }

  evalCode(
    transform(code, compileOptions),
    { ...scope, render }
  )
}
