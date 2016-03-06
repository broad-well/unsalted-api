// ---------- CONSTANTS ----------

const requiredArguments = ["text", "image", "options"];
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
var debug = false;

// ---------- FRONTEND ----------

function unsaltify(package, options) {
    if(_mod_utilities["type-check"](package, "string") &&
       _mod_utilities["type-check"](options, "string", false)){
        if(!(package in packages)){
            grudge("This package identifier is not found/supported.");
            return false;
        }else{
            var local_options = packages[package]
            local_options['options'] = options ? options : '';
            apply(local_options);
            return true;
        }
    }else{
        return false;
    }
}

function options_available() {
    return Object.keys(_mod_options_modifiers);
}

// ---------- BACKEND ----------

function apply(map){
    log("apply() initiated.");
    printMap(map);
    if(validateMap(map)){
        log("apply: Building ActionMap...");
        var action_map = map;
        map = null;
        action_map['txt-appl'] = ["p", "h1", "h2", "h3", "h4", "h5", "b", "i", "span", "title", "li", "strong", "em"];
        action_map['img-appl'] = ["img"];
        action_map['bkg-appl'] = ["span", "div"];
        var options = _mod_utilities['convert-options'](action_map['options'])
        for(var i = 0; i < options.length; i++){
            log("Applying option " + options[i]);
            action_map = _mod_options_modifiers[options[i]](action_map);
            log("New ActionMap: " + _mod_options_modifiers[options[i]](action_map));
        }
        log("apply: Exiting, calling doReplace.")
        doReplace(action_map);
    }else{
        grudge("Application aborted because of internal backend error. (apply, map invalid)");
    }
}

function doReplace(actionMap){
    log("doReplace() initiated.");
    //Call elements from _mod_element_replacers.
    for(var a = 0; a < Object.keys(_mod_element_replacers).length; a++){
        var sets = []
        for(var i = 0; i < actionMap[Object.keys(_mod_element_replacers)[a]].length; i++){
            //Collect HTML elements.
            log("doReplace: Collecting HTML elements with TagName " + actionMap[Object.keys(_mod_element_replacers)[a]][i]);
            sets.push(document.getElementsByTagName(actionMap[Object.keys(_mod_element_replacers)[a]][i]));
        }
        log(sets)
        for(var i = 0; i < sets.length; i++)
            if(sets[i])
                for(var o = 0; o < sets[i].length; o++){
                    log("doReplace: Invoking " + sets[i][o]);
                    _mod_element_replacers[Object.keys(_mod_element_replacers)[a]](sets[i][o], actionMap);
                }
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
            if(!(options[i] in _mod_options_modifiers)){
                grudge("validateMap: Failed, unidentified option found: \"" + options[i] + "\"");
                return false;
            }
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

function printMap(map){
    if(_mod_utilities['isMap'](map)){
        var output = []
        for(var i = 0; i < Object.keys(map).length; i++){
            output.push(Object.keys(map)[i] + ": " + map[Object.keys(map)[i]]);
        }
    }
    for(var i = 0; i < output.length; i++){
        log(output[i]);
    }
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
        if(optionsString){
            var output = [];
            var splitArray = optionsString.split(" ");
            for(var i = 0; i < splitArray.length; i++){
                if(splitArray[i]){
                    output.push(splitArray[i]);
                }
            }
            return output
        }else{
            return [];
        }
    },
    'isMap':function(obj){
        try{
            1 in obj;
            return true;
        }catch(e){
            return false;
        }
    },
    'type-check':function(obj, targetType, reinforced){
        reinforced = reinforced === undefined ? true : reinforced;
        if(typeof obj === targetType){
            return true;
        }else{
            if(reinforced){
                grudge("TypeCheck error: Expected type " + targetType + ", encountered " + typeof obj);
                return false;
            }else{
                console.warn("TypeCheck warning: Expected type " + targetType + ", encountered " + typeof obj + 
                    ", suppressed because of reinforcement attribute");
                return true;
            }
        }
    }
}

const _mod_element_replacers = {
    'txt-appl':function(element, replacement){
        element.innerHTML = replacement['text'];
    },
    
    'img-appl':function(element, replacement_img){
        element.src = replacement_img['image'];
    },
    
    'bkg-appl':function(element, replacement_img){
        element.style.backgroundImage = "url(\"" + replacement_img['image'] + "\")"
    }
}