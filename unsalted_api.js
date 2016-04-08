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
	
	var PackageProvider = {
		pkg: undefined,
		setPkg: function(pkgname){
			if(!Object.keys(PackagesAvailable).includes(pkgname)){
				throw new Error("Input Pkgname non-existent");
			}else{
				this.pkg = PackagesAvailable[pkgname];
				return true;
			}
		},
		getPkgName: function() {
			if(!this.pkg) return undefined;
			Object.keys(PackagesAvailable).forEach(function(item){
				if(PackagesAvailable[item] === this.pkg) return item;
			});
			return false;
		}
	};
	
	var Modules = {
		text: {
			replace: function(element){
				element.innerHTML = PackageProvider.pkg.text;
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
			replace: function(element){
				element.src = PackageProvider.pkg.image;
			},
			fetch: function() {
				return [].slice.call(document.getElementsByTagName("img"));
			},
			enabled: true
		},
		
		background: {
			replace: function(element){
				element.style.backgroundImage = PackageProvider.pkg.background;
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
	
	function mainRoutine() {
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
				Modules[i].replace(item);
				counter++;
			});
			log("Finished. Statistics:");
			log("Item count: " + counter);
			log("");
		});
		log("All Replacements finished.");
		log("All queued actions finished.");
	}
	
	function definePackage(pkgname){
		if(!pkgname){
			throw new TypeError("definePackage called without a proper pkgname. Required type: string");
		}else{
			if(!(Object.keys(PackagesAvailable).includes(pkgname))){
				throw new TypeError("definePackage called without a valid packagename. Received argument: " + pkgname);
			}else{
				Object.keys(PackagesAvailable[pkgname]).forEach(function(i){
					if(!Object.keys(Modules).includes(i))
						throw new Error("Invalid package - unmatched parameters - parameter not loaded as module: " + i);
					else{
						if(PackageProvider.getPkgName() === pkgname){
							console.warn("Package " + pkgname + " already selected");
							return;
						}else{
							//Integrity check
							Object.keys(Modules).forEach(function(i){
								if(!Object.keys(PackagesAvailable[pkgname]).includes(i)){
									throw new TypeError("Incompatible package - required type " + i + " not present.");
								}
							});
							PackageProvider.setPkg(pkgname);
							log("Selected package is now " + pkgname);
							return true;
						}
					}
				});
			}
		}
	}
	
	return {
		unsaltify: function(pkg, modifiers){
			if(pkg) definePackage(pkg);
			mainRoutine();
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