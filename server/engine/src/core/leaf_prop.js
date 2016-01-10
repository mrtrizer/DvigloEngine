import Leaf from "leaf.js";

class LeafPropAny {
	
	constructor(leaf, name, params) {
		if (!leaf instanceof Leaf)
			throw new Error("Invalid leaf argument. It has to extend Leaf. Value: " + leaf);
		if (typeof(name) !== "string")
			throw new Error("Invalid name argument. It has to be string. Value: " + name);
		if (typeof(params) !== "object")
			throw new Error("Invalid params argument. It has to be object. Value: " + params);
		this.leaf = leaf;
		this.params = params;
		this.name = name;
		this.setValue(this.getDefValue());
	}
	
	///Assigns value to the object, given in constructor after checking
	setValue(value) {
		if (this.checkValue(value))
			this.value = value;
		else {
			if (!this.checkValue(value))
				this.value = this.getDefValue();
		}
	}
	
	getValue() {
		return this.value;
	}
	
	checkValue(value) {
		if (value === undefined)
			return false;
		return true;
	}
	
	getDefValue() {
		if (this.checkValue(this.params.def))
			return this.params.def;
		else
			return this.getTypeDefValue();
	}
	
	getTypeDefValue() {
		return null;
	}
	
	///Extracts value from JSON data, using name, given in constructor.
	extract(srcData) {
		if (typeof(srcData) !== "object")
			throw new Error("Invalid srcData parameter. It has to be object.");
		if (srcData[this.name] != undefined)
			this.setValue(srcData[this.name]);
		else
			this.setValue(this.getDefValue());
	}
}

class LeafPropJSON extends LeafPropAny {
	
	checkValue(value) {
		if (!super.checkValue(value))
			return false;
		if (typeof(value) !== "object")
			return false;
		return true;
	}
	
	getTypeDefValue() {
		return {};
	}
}

class LeafPropSwitch extends LeafPropAny {
	
	checkValue(value) {
		this.checkList();
		if (!super.checkValue(value))
			return false;
		if (this.params.list.indexOf(value) >= 0)
			return true;
		return false;
	}
	
	checkList() {
		if (this.params.list === undefined) {
			console.log("No list param in switcher defenition.");
			this.params.list = [];
		}
		if (!Array.isArray(this.params.list)) {
			console.log("Invalid list param. It has to be array.");
			this.params.list = [];
		}
	}
	
	getTypeDefValue() {
		this.checkList();
		if (this.params.list.length == 0)
			return null;
		else
			return this.params.list[0];
	}
}

class LeafPropStr extends LeafPropAny {
	
	checkValue(value) {
		if (!super.checkValue(value))
			return false;
		if (typeof(value) !== "string")
			return false;
		if (typeof(this.params.max_len) === "number")
			if (value.length > this.params.max_len)
				return false;
		return true;
	}
	
	getTypeDefValue() {
		return "";
	}
}

class LeafPropNum extends LeafPropAny {
	
	checkValue(value) {
		if (!super.checkValue(value))
			return false;
		if (typeof(value) !== "number")
			return false;
		if (typeof(this.params.max) === "number")
			if (value > this.params.max)
				return false;
		if (typeof(this.params.min) === "number")
			if (value < this.params.min)
				return false;
		return true;
	}
	
	getTypeDefValue() {
		return 0;
	}
}

class LeafPropInt extends LeafPropNum {
	
	checkValue(value) {
		if (!super.checkValue(value))
			return false;
		if (Number.isInteger(value))
			return true;
		return false;
	}
}

class LeafPropUInt extends LeafPropInt {
	
	checkValue(value) {
		if (!super.checkValue(value))
			return false;
		if (value >= 0)
			return true;
		return false;
	}
}

class LeafPropFloat extends LeafPropNum {
	
}

var propTypes = {
	any:LeafPropAny,
	str:LeafPropStr,
	num:LeafPropNum,
	int:LeafPropInt,
	uint:LeafPropUInt,
	float:LeafPropFloat,
	json:LeafPropJSON,
	sw:LeafPropSwitch
};

export default function createProp(propType, propName, propSrc) {
	if (propType === undefined)
		propType = "any";
	if (typeof(propTypes[propType]) !== "function")
		throw new Error("Unknown property type: " + propType);
	return new propTypes[propType](this, propName, propSrc);
}
