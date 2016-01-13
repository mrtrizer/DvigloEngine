import Res from "res.js";

export default ResMgr {
	constructor (srcList) {
		this.list = [];
		for (let src of srcList)
		{
			let res = this.createRes(src);
			this.list.push(res);
		}
	}
	
	find (id) {
		var list = [];
	}
	
	createRes(src) {
		if (src.type == "img") {
			return new ResImg(src);
		}
	}
}
