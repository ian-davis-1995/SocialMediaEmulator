import { LetterResult } from "../results/LetterResult";
import { SentenceResult } from "../results/SentenceResult";
import { serializeResultMessage } from "./serialized_data/result_message";

const API_KEY = "9463d2d2-8560-40ea-8f4e-739ac9afed2c";
const BASE_URL = "/digital-deception/rspan";

class JSONAPIDriver {
    put(request_url: string, data: object): Promise<Response> {
        const url = BASE_URL + "/" + request_url;
        const payload = JSON.stringify(data);

        const requestOptions: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Length": payload.length.toString(),
                "Content-Type": "application/json",
                "X-HTTP-APIKEY": API_KEY,
            },
            body: payload,
        }

        return fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            });
    }

    get(request_url: string): Promise<Response> {
        const url = BASE_URL + "/" + request_url;
        const requestOptions = {
            method: "GET",
            headers: {
                "X-HTTP-APIKEY": API_KEY,
            },
        };

        return fetch(url, requestOptions).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        })
    }
}

export default class ServerDriver extends JSONAPIDriver {
    uploadTestResult(subjectId: string, experimentVersion: string, timestamp: Date, letterResult: LetterResult, sentenceResult: SentenceResult): Promise<Response> {
        return this.put("api/result", serializeResultMessage(subjectId, experimentVersion, timestamp, letterResult, sentenceResult));
    }
}