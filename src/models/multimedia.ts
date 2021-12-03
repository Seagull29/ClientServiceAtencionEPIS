import { FetchData } from "@config/fetchData";
import { links } from "@config/util";

export class Multimedia {
    
    static readonly #endpoint : string = 'multimedia';
    static #axiosInstance : any = new FetchData(links.apiDomain);

    static search = async (query : string, filter : string) : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/search`,
            query,
            filter
        });
        return data.data;
    }

    static add = async (form : any, headers : any) : Promise<any | null> => {
        const data = await this.#axiosInstance.postRequest({
            requestUrl: `${this.#endpoint}/add`,
        }, form, headers);
        return data;
    }

    static list = async () : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/`,
        });
        return data.data;
    }

}