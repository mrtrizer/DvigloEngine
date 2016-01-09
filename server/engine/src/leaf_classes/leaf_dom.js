import Leaf from "leaf.js";

export default class LeafCanvas extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	constructor ()
	{
		super();
	}
	
	init()
	{
		console.log("LeafDOM initialized");
	}

}
