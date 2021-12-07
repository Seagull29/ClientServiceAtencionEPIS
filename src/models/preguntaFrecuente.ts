import { FetchData } from "@config/fetchData";
import { links } from "@config/util";

export class PreguntaFrecuente {
    
    static readonly #endpoint : string = 'preguntasFrecuentes';
    static #axiosInstance : any = new FetchData(links.apiDomain);

    static search = async (query : string, filter : string) : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/search`,
            query,
            filter
        });
        return data.data;
    }

    static add = async ({ ...body }) : Promise<any | null> => {
        const data = await this.#axiosInstance.postRequest({
            requestUrl: `${this.#endpoint}/add`,
            ...body
        });
        return data;
    }

    static list = async () : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/`,
        });
        return data.data;
    }

}