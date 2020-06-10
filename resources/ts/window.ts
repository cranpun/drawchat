import { MyAxios } from "./u/myaxios";
declare global {
    interface Window {
        axios: MyAxios
    }
}
export { }