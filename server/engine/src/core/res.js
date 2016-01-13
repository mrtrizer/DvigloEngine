export default class Res {
	constructor(src) {
		if (typeof(src) !== "object")
			throw new Error("Invalid resource source. Source has to be an object");
	}
	
	isReady () {
		return false;
	}
	
	update (ready,error) {
		if (typeof(error) === "function")
			error("Invalid resource type");
	}
	
}
