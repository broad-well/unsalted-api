// ---------- CONSTANTS ----------

var imagePath = "http://www.priorityhealth.com.au/productimages/BB3410.jpg";
var fillName = "Unsalted Peanuts";
const requiredArguments = ["text", "image", "options"];
const text_tags = ["p", "h1", "h2", "h3", "h4", "h5", "b", "i", "span", "title", "li", "strong", "em"];
const img_tags = ["img"];
const bkg_tags = ["span", "div"]
const action_categories = ["txt-appl", "img-appl", "bkg-appl"]
const packages = {
    'usp':{
        'text':'Unsalted Peanuts',
        'image':'http://www.priorityhealth.com.au/productimages/BB3410.jpg'
    },
    
    'trump':{
        'text':'Donald Trump',
        'image':'http://static6.businessinsider.com/image/55918b77ecad04a3465a0a63/nbc-fires-donald-trump-after-he-calls-mexicans-rapists-and-drug-runners.jpg'
    }
    //THIS PROGRAM IS NOT AFFILIATED TO THE IMAGES BY ANY MEANS. ANY COPYRIGHTS BELONG TO THE IMAGE OWNER.
}
var debug = true; // todo To be changed after sufficient testing.

// ---------- FRONTEND ----------

function unsaltify(package) {
	if(!(package in packages)){
        grudge("This package identifier is not found/supported.");
        return false;
    }else{
        apply(packages[package])
        return true;
    }
}



// ---------- BACKEND ----------

function apply(map){
    log("apply() initiated.");
    if(validateMap(map)){
        log("apply: Building ActionMap...");
        var action_map = map;
        delete action_map['options'];
        action_map['txt-appl'] = text_tags;
        action_map['img-appl'] = img_tags;
        action_map['bkg-appl'] = bkg_tags;
        var options = _mod_utilities["convert-options"](map['options'])
        for(var i = 0; i < options.length; i++){
            action_map = _mod_options_modifiers[options[i]](action_map);
        }
        var "apply: Exiting, calling doReplace."
        doReplace(action_map);
    }else{
        grudge("Application aborted because of internal backend error. (apply, map invalid)");
    }
}

function doReplace(actionMap){
    log("doReplace() initiated.");
    //Call elements from _mod_element_replacers.
    for(var a = 0; a < action_categories.length; a++){
        var sets = []
        for(var i = 0; i < actionMap[action_categories[a]].length; i++){
            //Collect HTML elements.
            log("doReplace: Collecting HTML elements with TagName " + actionMap[action_categories[a]][i]);
            sets.push(document.getElementsByTagName(actionMap[action_categories[a]][i]));
        }
        log(sets)
        for(var i = 0; i < sets.length; i++)
            if(sets[i])
                for(var o = 0; o < sets[i].length; o++)
                    log("doReplace: Invoking " + sets[i][o]);
                    _mod_element_replacers[action_categories[a]](sets[i][o], actionMap[action_categories[a]]);
    }
    log("doReplace() finished.");
}

function validateMap(map){
    if(!_mod_utilities['isMap'](map))
        return false;
    for(var i = 0; i < requiredArguments.length; i++){
        if(!(requiredArguments[i] in map))
            return false;
    }
    var options = map['options'].split(" ")
    for(var i = 0; i < options.length; i++){
        if(options[i])
            if(!(options[i] in _mod_options_modifiers))
                return false;
    }
    return true;
}

function grudge(moaning_reason){
    console.error("UnsaltedAPI: " + moaning_reason);
}

function log(text){
    if(debug)
        console.log("UnsaltedAPI: " + text);
}

// ---------- MODULES ----------

const _mod_options_modifiers = {
    'include-a': function(actionMap){
        //Includes 'A' tag in txt-appl.
        var txt_appl = actionMap['txt-appl']
        txt_appl.push("a");
        actionMap['txt-appl'] = txt_appl;
        return actionMap
    },
    
    'include-div': function(actionMap){
        //Includes 'DIV' tag in txt-appl.
        var txt_appl = actionMap['txt-appl']
        txt_appl.push("div");
        actionMap['txt-appl'] = txt_appl;
        return actionMap
    },
    
    'ignore-image': function(actionMap){
        //Clears img-appl.
        actionMap['img-appl'] = [];
        return actionMap
    },
    
    'ignore-background': function(actionMap){
        //Clears bkg-appl.
        actionMap['bkg-appl'] = [];
        return actionMap
    }
};

const _mod_utilities = {
    'convert-options':function(optionsString){
        var output = [];
        var splitArray = optionsString.split(" ");
        for(var i = 0; i < splitArray.length; i++){
            if(splitArray[i]){
                output.push(splitArray[i]);
            }
        }
        return output
    },
    'isMap':function(obj){
        try{
            1 in obj;
            return true;
        }catch(e){
            return false;
        }
    }
}

const _mod_element_replacers = {
    'txt-appl':function(element, replacement){
        element.innerHTML = replacement;
    },
    
    'img-appl':function(element, replacement_img){
        element.src = replacement_img;
    },
    
    'bkg-appl':function(element, replacement_img){
        element.style.backgroundImage = "url(\"" + replacement_img + "\")"
    }
}