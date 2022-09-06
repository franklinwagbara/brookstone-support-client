import axios, {AxiosInstance} from 'axios';

const BASEURL = 'http://localhost:5000/api/';

export class HttpService {
  private readonly _axios: AxiosInstance;

  constructor(baseUrl?: string) {
    this._axios = axios.create({
      baseURL: baseUrl ?? BASEURL,
    });
  }
  public async get(query: string) {
    return await this._axios.get(query);
  }

  public async post(query: string, data: object) {
    return await this._axios.post(query, data, {withCredentials: true});
  }

  public async put(query: string, data: object) {
    return await this._axios.put(query, data, {withCredentials: true});
  }

  public async delete(query: string) {
    return await this._axios.delete(query, {withCredentials: true});
  }
}
