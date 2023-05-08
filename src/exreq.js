import axios from "axios";
import { log } from "./utils";

export function setToken (token) {
	axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export async function exreq ({ url, method = "get", data = null, options = {} }) {
	try {
		const response = await axios({
			url,
			method,
			headers: options?.headers,
			params: options?.params,
			data,
			...options,
		});

		if (options?.debug) {
			log.info(`status: ${response.status} - ${response.statusText}`);
			log.print({ Headers: response.headers });
			log.print({ "Request Config": response.config });
		}

		options?.verbose && log.print({ Response: response.data });

		return [null, response.data];
	} catch (error) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			if (options?.debug) {
				log.warn(`status: ${error.response.status}`);
				log.print({ Headers: error.response.headers });
				log.print({ Config: error.config });
			}

			return [error.response.data];
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			options?.debug && log.print({ Config: error.config });

			return [error.request];
		}

		// Something happened in setting up the request that triggered an Error
		options?.debug && log.print({ Config: error.config });

		return [error.message];
	}
}
