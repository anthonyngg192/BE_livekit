export class ReturnErrorModel {
  constructor(public statusCode: string, public params?: any) {
    this.params = params;
    this.statusCode = statusCode;
  }
}
