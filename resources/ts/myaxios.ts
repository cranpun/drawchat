export interface MyAxiosApi { }
export interface MyAxiosResponse {
    data: string | number | { [key: string]: string | number; } | any[];
}
export interface MyAxios {
    get(url: string): MyAxiosApi;
    post(url: string, postdata?: { [key: string]: string | number; });
    all(api: MyAxiosApi): [MyAxiosResponse];
}