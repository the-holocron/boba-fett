export function parseArgs (args) {
	if (args.length === 0) {
		return [null, {}];
	}

	if (args.length === 1) {
		if (typeof args[0] !== "object") {
			return [args[0], {}];
		}

		return [null, args[0]];
	}

	return args;
}

export const setBaseURL = (conf, service, environment = "development") => conf[service][environment];

// credit: https://stackoverflow.com/a/20392392
export function isJSON (str) {
	try {
		const obj = JSON.parse(str);

		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) nor JSON.parse(1234) throw errors, hence the type-checking,
		// JSON.parse(null) returns null, and typeof null === "object" so check for that, too; null is falsey, so this suffices:
		if (obj && typeof obj === "object") {
			return [null, obj];
		}

		return [{ message: "Not valid JSON" }];
	} catch (err) {
		return [{ message: err }];
	}
}

export const log = {
	error: (msg) => console?.error(msg),
	info: (msg) => console?.info(msg),
	print: (msg) => console?.log(msg),
	warn: (msg) => console?.warn(msg),
};
