import { FetchData } from "@config/fetchData";
import { links } from "@config/util";

export class Reporte {
    
    static readonly #endpoint : string = 'reportes';
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

    static update = async ({ ...body }) : Promise<any | null> => {
        const data = await this.#axiosInstance.putRequest({
            requestUrl: `${this.#endpoint}/update`,
            ...body
        });
        return data;
    }

    static delete = async ({ ...body }) : Promise<any | null> => {
        const data = await this.#axiosInstance.deleteRequest({
            requestUrl: `${this.#endpoint}/delete`,
            ...body
        });
        return data;
    }

    static report = async (startDate : Date, endDate : Date, filter : string) : Promise<any | null> => {
        const data = await this.#axiosInstance.getRequest({
            requestUrl: `${this.#endpoint}/report`,
            startDate,
            endDate,
            filter
        });
        return data.data;
    }

}