var imagePath = "http://www.priorityhealth.com.au/productimages/BB3410.jpg";
var fillName = "Unsalted Peanuts";

/**
 * Makes a webpage filled with Unsalted Peanuts.
 * Arguments are optional.
 *
*/
function unsaltify(image, text){
	image = image != null ? image : imagePath;
	text = text != null ? text: fillName;
	var images = document.getElementsByTagName("img"); 
	for (var i = 0; i < images.length; i++){ 
		images[i].src = image;
	}
	var textTags = ["p", "h1", "h2", "h3", "h4", "h5", "b", "i", "span", "title", "li"]; 
	var sets = []; 
	for (var i = 0; i < textTags.length; i++){
		sets.push(document.getElementsByTagName(textTags[i]));
	}
	for (var i = 0; i < sets.length; i++){ 
		if(sets[i]) {
			for (var o = 0; o < sets[i].length; o++) { 
				if (sets[i][o].tagName == "span"){
					sets[i][o].style.backgroundImage = "url(\"" + image + "\")";
				}  
				sets[i][o].innerHTML = text;
			}
		}
	}
}