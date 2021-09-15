namespace Pageantion {
  export interface Request<T> {
    condition?: T;
    page?: number;
    limit?: number;
  }

  export interface Response<T> {
    count: number;
    data: T;
  }

  export interface PageResponseData {
    id: number;
    create_time: string;
    update_time: string;
  }
}
