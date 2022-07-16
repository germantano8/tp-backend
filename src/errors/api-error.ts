class ApiError {
  status: number;
  message: string;
  nestedErrors?: any[];

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export default ApiError;
