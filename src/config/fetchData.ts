
const axios = require("axios");

export class FetchData {

    readonly #baseUrl: string;
    readonly #timeout: number = 90000;
    #instance : any;

    constructor(baseUrl : string, config? : any) {
        this.#baseUrl = baseUrl
        this.#instance = axios.create({
            baseURL: this.#baseUrl,
            timeout: this.#timeout,
            ...config
        });
    }

    getRequest = async ({ requestUrl, ...requestParams }) : Promise<any | null> => {
        try {
            const response : any = await this.#instance.get(
                requestUrl,
                { params: requestParams }
            );
            if (await this.#verifyGetRequest(response.data)) {
                return null;
            }
            return response.data;
        } catch (err) {
            return null;
        }   
        
    }

    postRequest = async ({ requestUrl, ...requestParams }, form? : any, headers? : any) : Promise<any | null> => {
        try {
            let response : any = form ? await this.#instance.post(
                requestUrl,
                form,
                { headers },
            ) : await this.#instance.post(
                requestUrl,
                requestParams
            );
           
            if (await this.#verifyPostRequest(response.data)) {
                return null;
            }
            return response.data;
        } catch (err) {
            return err.message;
            return null;
        }   
        
    }

    putRequest = async ({ requestUrl, ...requestParams }, form? : any, headers? : any) : Promise<any | null> => {
        try {
            let response : any = form ? await this.#instance.put(
                requestUrl,
                form,
                { headers },
            ) : await this.#instance.put(
                requestUrl,
                requestParams
            );
           
            if (await this.#verifyPostRequest(response.data)) {
                return null;
            }
            return response.data;
        } catch (err) {
            return err.message;
            return null;
        }   
        
    }


    #verifyGetRequest = async (res: any) : Promise<boolean> => {
        const error = res.data.error ? true : false;
        return error;
    }

    #verifyPostRequest = async (res: any) : Promise<boolean> => {
        const error = res.error ? true : false;
        return error;
    }
}







/*
const main = async () => {
    const fetchting : FetchData = new FetchData('http://localhost:5000/api/');
    const data = await fetchting.getRequest({
        requestUrl: 'estudiantes/search/',
        query: '018100264a',
        filter: 'codigo'
    });

   
    
    console.log(data);
}

main();*/





