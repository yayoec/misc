// --------------------------------------------------------------------------
// File name   : deepCopy.js
// Description : return
// Author: Jeo收集于网上 (yayoec@gmail.com)
// Version 1.0
// --------------------------------------------------------------------------

//精简版
 function deepCopy(srcInstance) {
	if(typeof(srcInstance) != "object" || srcInstance == null)
		return srcInstance;
	var newInstance = srcInstance.constructor();
	for(var i in srcInstance)
		newInstance[i] = deepCopy(srcInstance[i]);
	return newInstance;
}

//死脑筋版 思想是穷举 没有技术含量
var ObjectHandler = {
    //public method
    getCloneOfObject: function(oldObject) {
        var tempClone = {};

        if (typeof(oldObject) == "object")
            for (prop in oldObject)
                // for array use private method getCloneOfArray
                if ((typeof(oldObject[prop]) == "object") &&
                                (oldObject[prop]).__isArray)
                    tempClone[prop] = this.getCloneOfArray(oldObject[prop]);
                // for object make recursive call to getCloneOfObject
                else if (typeof(oldObject[prop]) == "object")
                    tempClone[prop] = this.getCloneOfObject(oldObject[prop]);
                // normal (non-object type) members
                else
                    tempClone[prop] = oldObject[prop];

        return tempClone;
    },

    //private method (to copy array of objects) - getCloneOfObject will use this internally
    getCloneOfArray: function(oldArray) {
        var tempClone = [];

        for (var arrIndex = 0; arrIndex <= oldArray.length; arrIndex++)
            if (typeof(oldArray[arrIndex]) == "object")
                tempClone.push(this.getCloneOfObject(oldArray[arrIndex]));
            else
                tempClone.push(oldArray[arrIndex]);
        return tempClone;
    }
};



