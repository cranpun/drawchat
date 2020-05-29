import { MyAxios } from "./myaxios";
declare global {
    interface Window {
        axios: MyAxios
    }
}
export { }