var UnsaltedAPI = (function() {
	var commonElements = {
		all: function() {return [].slice.call(document.querySelectorAll("*"))}
	};

	var PackagesAvailable = {
		usp: {
			text: "Unsalted Peanuts",
			image: "http://www.priorityhealth.com.au/productimages/BB3410.jpg",
			background: "http://www.priorityhealth.com.au/productimages/BB3410.jpg"
		},

		trump: {
			text: "Donald Trump!",
			image: "http://static6.businessinsider.com/image/55918b77ecad04a3465a0a63/nbc-fires-donald-trump-after-he-calls-mexicans-rapists-and-drug-runners.jpg",
			background: "http://static6.businessinsider.com/image/55918b77ecad04a3465a0a63/nbc-fires-donald-trump-after-he-calls-mexicans-rapists-and-drug-runners.jpg"
		},
	};

	var Modules = {
		text: {
			replace: function(element, pkgname){
				element.innerHTML = PackagesAvailable[pkgname].text;
			},
			fetch: function(){
				//Use children filter.
				var output = [];
				commonElements.all().forEach(function(item){
					if(item.children.length === 0 && item.tagName !== "style" && item.tagName !== "link" && item.tagName !== "script"){
						output.push(item);
					}
				});
				return output;
			},
			enabled: true
		},

		image: {
			replace: function(element, pkgname){
				element.src = PackagesAvailable[pkgname].image;
			},
			fetch: function() {
				return [].slice.call(document.getElementsByTagName("img"));
			},
			enabled: true
		},

		background: {
			replace: function(element, pkgname){
				element.style.backgroundImage = "url('" + PackagesAvailable[pkgname].background + "')";
			},
			fetch: function() {
				return commonElements.all();
			},
			enabled: true
		}
	};

	function log(str){
		if(true){
			if(str === '')
				console.log('');
			else
				console.log("unsalted-api: " + str);
		}
	}

	function mainRoutine(pkgname) {
		var MainNamespace = {};
		Object.keys(Modules).forEach(function(i, index){
			log("Fetching Items Of Type " + i);
			MainNamespace[i] = Modules[i].fetch();
			log("Finished. Array Information:");
			log("Length: " + MainNamespace[i].length);
			log("");
		});
		log("All Fetching finished.");
		Object.keys(Modules).forEach(function(i, index){
			log("Replacing Items Of Type " + i);
			var counter = 0;
			MainNamespace[i].forEach(function(item){
				Modules[i].replace(item, pkgname);
				counter++;
			});
			log("Finished. Statistics:");
			log("Item count: " + counter);
			log("");
		});
		log("All Replacements finished.");
	}

	function validatePackage(pkg){
		Object.keys(Modules).forEach(function(i){
			if(!Object.keys(pkg).includes(i)){
				return false;
			}
		});
		return true;
	}

	return {
		unsaltify: function(pkg, modifiers){
			if(!pkg){
				console.error("Package name not defined");
				return false;
			}
			mainRoutine(pkg);
		},
		usp: function(pkg, modifiers){
			this.unsaltify(pkg, modifiers);
		},
		help_modifier: function() {

		},
		dev: {
			modules: Modules,
			pkgs: PackagesAvailable
		}
	};
}());
