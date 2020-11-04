export class AjaxError extends Error {
  code?: number;
  req?: XMLHttpRequest;
  constructor(message?: string, req?: XMLHttpRequest, code?: number) {
    super(message);
    if (message) this.message = message;
    if (req) this.req = req;
    if (code) this.code = code;
  }
}

export class AbortError extends AjaxError {
  name = 'AbortError'
  constructor(message?: string, req?: XMLHttpRequest, code?: number) {
    super(message, req, code);
  }
}
export class TimeOutError extends AjaxError {
  name = 'TimeOutError'
  constructor(message?: string, req?: XMLHttpRequest, code?: number) {
    super(message, req, code);
  }
}

export class NotSuccessError extends AjaxError {
  name = 'NotSuccessError'
  constructor(message?: string, req?: XMLHttpRequest, code?: number) {
    super(message, req, code);
  }
}
