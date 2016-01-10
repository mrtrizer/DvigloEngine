import Leaf from "leaf.js";

export default class LeafInputCtrl extends Leaf{
	input(e) {
		console.log("Mouse event:",e.type);
	}
}
