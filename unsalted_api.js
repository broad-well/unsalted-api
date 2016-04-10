var UnsaltedAPI = (function() {
	var debug = false;
	var originalDocument = document.getElementsByTagName("html")[0].innerHTML;
	var commonElements = {
		all: function() {return [].slice.call(document.querySelectorAll("*"))}
	};

	function pickRandom(list){
		return list[Math.floor(Math.random() * list.length)];
	}

	var Packages = {
		usp: {
			text: ["Unsalted Peanuts"],
			image: "http://www.priorityhealth.com.au/productimages/BB3410.jpg",
			background: "http://www.priorityhealth.com.au/productimages/BB3410.jpg"
		},

		trump: {
			text: ["Donald Trump!", "TRUMP", "Donald J. Trump", "Donald Trump"],
			image: "http://static6.businessinsider.com/image/55918b77ecad04a3465a0a63/nbc-fires-donald-trump-after-he-calls-mexicans-rapists-and-drug-runners.jpg",
			background: "http://static6.businessinsider.com/image/55918b77ecad04a3465a0a63/nbc-fires-donald-trump-after-he-calls-mexicans-rapists-and-drug-runners.jpg"
		},

		pearson_dilation: {
			text: ["Dilations, dilations, the groovy transformations!"],
			image: "",
			background: ""
		}
	};

	var Modules = {
		text: {
			TextElements: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'code', 'b', 'strong', 'em', 'i'],
			replace: function(element, pkgname){
				element.innerHTML = pickRandom(pkgname);
			},
			fetch: function(){
				//Use children filter.
				var output = [];
				commonElements.all().forEach(function(item){
					if((item.children.length === 0 && item.tagName !== "style" && item.tagName !== "link" && item.tagName !== "script") || Modules.text.TextElements.includes(item.tagName)){
						output.push(item);
					}
				});
				return output;
			},
			enabled: true
		},

		image: {
			replace: function(element, pkgname){
				element.src = pkgname;
			},
			fetch: function() {
				return [].slice.call(document.getElementsByTagName("img"));
			},
			enabled: true
		},

		background: {
			replace: function(element, pkgname){
				element.style.backgroundImage = "url('" + pkgname + "')";
			},
			fetch: function() {
				return commonElements.all();
			},
			enabled: true
		}
	};

	function log(str){
		if(debug){
			if(str === '')
				console.log('');
			else
				console.log("unsalted-api: " + str);
		}
	}

	function compileModifierString(modstring) {
        if (!modstring) {
            return {};
        }else{
			// Expected string: "-:text,-:image" or ""
			var output = {};
			var array = modstring.length == 0 ? [] : modstring.split(",");
			for(var i of array){
				var elems = i.split(":");
				if (elems.length !== 2) {
                    throw new Error("Invalid Syntax in modifier string for element number " + (array.indexOf(i) + 1) + ": None or multiple colons found, expected only one");
                }
				if (!Object.keys(Modules).includes(elems[1])) {
                    throw new Error("Invalid Syntax in modifier string for element number " + (array.indexOf(i) + 1) + ": unknown module named \"" + elems[1] + "\"");
                }
				if(output[elems[1]]){
					output[elems[1]].push(elems[0]);
				}else{
					output[elems[1]] = [elems[0]];
				}
				log("ModStringCompiler: Imported feature " + elems[0] + " for module " + elems[1]);
			}
			return output;
		}
    }

	function mainRoutine(pkgname, modifierString) {
		var modifiers = compileModifierString(modifierString);
		var MainNamespace = {};
		Object.keys(Modules).forEach(function(i, index){
			if(Modules[i].enabled && (modifiers[i] ? !modifiers[i].includes("-") : true)){
				log("Fetching Items Of Type " + i);
				MainNamespace[i] = Modules[i].fetch();
				log("Finished. Array Information:");
				log("Length: " + MainNamespace[i].length);
				log("");
			}
		});
		log("All Fetching finished.");
		Object.keys(Modules).forEach(function(i, index){
			if(Modules[i].enabled && (modifiers[i] ? !modifiers[i].includes("-") : true)){
				log("Replacing Items Of Type " + i);
				var counter = 0;
				MainNamespace[i].forEach(function(item){
					Modules[i].replace(item, Packages[pkgname][i]);
					counter++;
				});
				log("Finished. Statistics:");
				log("Item count: " + counter);
				log("");
			}
		});
		log("All Replacements finished.");
	}

	return {
		unsaltify: function(pkg, modifiers){
			if(!pkg){
				console.error("Package name not defined");
				return false;
			}
			if(typeof pkg !== "string"){
				console.error("PackageName not string");
				return false;
			}
			if(!Object.keys(Packages).includes(pkg)){
				console.error("Package not found");
				return false;
			}
			return mainRoutine(pkg, modifiers);
		},
		usp: function(pkg, modifiers){
			this.unsaltify(pkg, modifiers);
		},
		un_unsaltify: function(){
			if(originalDocument){
				document.getElementsByTagName("html")[0].innerHTML = originalDocument;
			}else{
				console.warn("Un-unsaltify not available");
			}
			return !!originalDocument;
		},
		dev: {
			modules: Modules,
			pkgs: Packages,
			debug: debug,
			utils: {
				pickRandom: function(list,max){
					return list[Math.floor(Math.random() * list.length)];
				}
			}
		}
	};
}());
