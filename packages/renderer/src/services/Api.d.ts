declare namespace Request {
  interface Time {
    start_time: string | number | Date;
    end_time: string | number | Date;
  }

  interface Pageantion {
    size: number;
    page: number;
  }

  interface ServerId {
    server_id: number;
  }

}

declare namespace Response {
  type PromiseResult<T> = Promise<Result<T>>;
  type PagenationResult<T> = Promise<Result<Pageantion<Array<T>>>>;
  type PageData<T> = Pageantion<Array<T>>;

  interface Result<T> {
    code: number;
    data: T;
    msg: string;
  }
  interface PageantionParam {
    page: number;
    size: number;
    total: number;
  }
  interface Pageantion<T> {
    pagination: {
      page: number;
      size: number;
      total: number;
    };
    list: T;
  }
}
