/* eslint-disable compat/compat,prefer-promise-reject-errors */
import axios from "axios";
import { exreq, isJSON, parseArgs, setBaseURL, setToken } from "../src/";

const mockToken = "mockToken";
const mockParams = {
	sort: "field1, field2",
	start: 1,
	limit: 500,
	query: "accountId==publisher/100",
};

jest.mock("axios");

beforeEach(() => {
	jest.clearAllMocks();
});

describe("Boba Fett", () => {
	describe("exreq", () => {
		it("should return a response", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => ({ data: { foo: "bar" } }));
			const [, data] = await exreq({ operation: "/foo" });

			expect(data.foo).toBe("bar");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a response in debug mode", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => ({ data: { foo: "bar" } }));
			const [, data] = await exreq({ operation: "/foo", options: { debug: true } });

			expect(data.foo).toBe("bar");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a response in verbose mode", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => ({ data: { foo: "bar" } }));
			const [, data] = await exreq({ operation: "/foo", options: { verbose: true } });

			expect(data.foo).toBe("bar");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a response in when erring", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ response: { data: "Something went wrong" } }));
			const [err] = await exreq({ operation: "/foo" });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a response in when erring in debug", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ response: { data: "Something went wrong" } }));
			const [err] = await exreq({ operation: "/foo", options: { debug: true } });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a request in when erring", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ request: "Something went wrong" }));
			const [err] = await exreq({ operation: "/foo" });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a request in when erring in debug", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ request: "Something went wrong" }));
			const [err] = await exreq({ operation: "/foo", options: { debug: true } });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a message in when erring", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ message: "Something went wrong" }));
			const [err] = await exreq({ operation: "/foo" });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});

		it("should return a message in when erring in debug", async () => {
			setToken(mockToken);
			axios.mockImplementationOnce(() => Promise.reject({ message: "Something went wrong" }));
			const [err] = await exreq({ operation: "/foo", options: { debug: true } });

			expect(err).toBe("Something went wrong");
			expect(axios).toHaveBeenCalledTimes(1);
		});
	});

	describe("parseArgs", () => {
		it("should return nullish values when passed 0 args", () => {
			const args = parseArgs([]);
			expect(args).toEqual(expect.arrayContaining([null, {}]));
		});

		it("should return a number when passed 1 args", () => {
			const args = parseArgs([1]);
			expect(args).toEqual(expect.arrayContaining([1, {}]));
			expect(args[0]).toEqual(expect.any(Number));
		});

		it("should return an object when passed 1 args", () => {
			const args = parseArgs([mockParams]);
			expect(args).toEqual(expect.arrayContaining([null, mockParams]));
		});

		it("should return values when passed more than 1 arg", () => {
			const args = parseArgs([1, { foo: "bar" }]);
			expect(args).toEqual(expect.arrayContaining([1, { foo: "bar" }]));
		});
	});

	describe("setBaseURL", () => {
		const mockConf = {
			mock: {
				development: "https://dev.com",
				test: "https://test.com",
				production: "https://prod.com",
			},
		};

		it("should return the default url", () => {
			const url = setBaseURL(mockConf, "mock");
			expect(url).toBe("https://dev.com");
		});

		it("should return a url", () => {
			const url = setBaseURL(mockConf, "mock", "test");
			expect(url).toBe("https://test.com");
		});
	});

	describe("isJSON", () => {
		it("should return JSON when valid JSON is given", () =>
			expect(isJSON('{"foo":"bar", "baz": "qux"}')[1]).toEqual(
				expect.objectContaining({ foo: "bar", baz: "qux" }),
			));
		it("should return false when false is given", () =>
			expect(isJSON(false)[0]).toEqual(expect.objectContaining({ message: "Not valid JSON" })));
		it("should return false when a number is given", () =>
			expect(isJSON(1234)[0]).toEqual(expect.objectContaining({ message: "Not valid JSON" })));
		it("should return false when null is given", () =>
			expect(isJSON(null)[0]).toEqual(expect.objectContaining({ message: "Not valid JSON" })));
		it("should return false when invalid JSON is given", () =>
			expect(isJSON("user@example.com")[0]).toMatchObject({ message: expect.any(Error) }));
	});
});
