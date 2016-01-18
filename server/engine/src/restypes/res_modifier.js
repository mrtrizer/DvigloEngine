import Res from "res_img.js";

export default class ResModifier extends Res {
  constructor (src,ready,error) {
		super(src);
		if (typeof(src.url !== "string")
			throw new Error("Invalid url param. URL has to be a string.");
		this.url = src.url;
		update(ready,error);
	}

	update(ready,error) {
	   ready();
	}

	isReady() {
	   return true;
	}
}
