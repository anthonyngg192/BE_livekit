import { HTTP_METHOD } from './constants';

export abstract class DTO {
  public static url: string;
  public abstract paramsDTO: any;
  public abstract queryDTO: any;
  public abstract bodyDTO: any;
  public abstract readonly url: string;
  public abstract readonly method: HTTP_METHOD;

  public get interpolatedUrl(): string {
    let url = this.url;
    if (this.paramsDTO) {
      Object.keys(this.paramsDTO).forEach((key) => {
        url = url.replace(':' + key, String(this.paramsDTO[key]));
      });
    }
    if (this.queryDTO) {
      Object.keys(this.queryDTO).forEach((key, index) => {
        if (this.queryDTO[key]) {
          url += (index === 0 ? '?' : '&') + key + '=' + String(this.queryDTO[key]);
        }
      });
    }
    return url;
  }
}
