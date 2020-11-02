export class AbortError extends Error {
  name = 'AbortError'
  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}
export class TimeOutError extends Error {
  name = 'TimeOutError'
  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}

export class NotSuccessError extends Error {
  name = 'NotSuccessError'
  code = 0
  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
    if (message) this.message = message;
  }
}

export class NeedLoginError extends Error {
  name = 'NeedLoginError'
  constructor(message?: string) {
    super(message);
    if (message) this.message = message;
  }
}