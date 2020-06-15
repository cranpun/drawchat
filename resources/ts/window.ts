import { MyAxios } from "./u/myaxios";
import { MyLodash } from "./u/mylodash";
declare global {
    interface Window {
        axios: MyAxios,
        _: MyLodash
    }
}
export { }