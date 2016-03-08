// ---------- CONSTANTS ----------

const requiredArguments = ["text", "image", "options"];
var packages = {
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
var config = {
    'text_elements':["p", "h1", "h2", "h3", "h4", "h5", "b", "i", "span", "title", "li", "strong", "em"],
    'image_elements':["img"],
    'background_elements':["div", "span"]
}
var debug = false;

// ---------- FRONTEND ----------

//Alias for unsaltify(...().
function usp(p, o){
    return unsaltify(p, o);
}

function unsaltify(package, options) {
    if(_mod_utilities.type_check(package, "string") &&
       _mod_utilities.type_check(options, "string", false)){
        if(!(package in packages)){
            grudge("This package identifier is not found/supported.");
            return false;
        }else{
            var local_options = packages[package]
            local_options.options = options ? options : '';
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

function import_modpack(module) {
    //A ModPack (Module Package) is a set of add-on modules to import into the resources of UnsaltedAPI.
    //Available keys: content_pkg, config, option_modifier, element_manipulator.
    for(var i = 0; i < Object.keys(module).length; i++){
        if(Object.keys(module)[i] in _mod_modpack_handlers){
            log("Importing module attribute " + Object.keys(module)[i] + " using core module _mod_modpack_handlers");
            if(_mod_modpack_handlers[Object.keys(module)[i]](module[Object.keys(module)[i]])){
                log("Import successful.");
            }else{
                console.error("Module key import failure! Key: " + Object.keys(module)[i]);
            }
        }else{
            console.warn("UnsaltedAPI: Encountered unsupported key in input ModPack: " + Object.keys(module)[i]);
        }
    }
}

// ---------- BACKEND ----------

function apply(map){
    log("apply() initiated.");
    printMap(map);
    if(validateMap(map)){
        log("apply: Building ActionMap...");
        var action_map = map;
        map = null;
        action_map.txt_appl = config.text_elements;
        action_map.img_appl = config.image_elements;
        action_map.bkg_appl = config.background_elements;
        var options = _mod_utilities.convert_options(action_map.options)
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
    if(!_mod_utilities.isMap(map))
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
    if(_mod_utilities.isMap(map)){
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
        //Includes 'A' tag in txt_appl.
        var txt_appl = actionMap.txt_appl
        txt_appl.push("a");
        actionMap.txt_appl = txt_appl;
        return actionMap
    },
    
    'include-div': function(actionMap){
        //Includes 'DIV' tag in txt_appl.
        var txt_appl = actionMap.txt_appl
        txt_appl.push("div");
        actionMap.txt_appl = txt_appl;
        return actionMap
    },
    
    'ignore-image': function(actionMap){
        //Clears img_appl.
        actionMap.img_appl = [];
        return actionMap
    },
    
    'ignore-background': function(actionMap){
        //Clears bkg_appl.
        actionMap.bkg_appl = [];
        return actionMap
    }
};

const _mod_utilities = {
    'convert_options':function(optionsString){
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
    'type_check':function(obj, targetType, reinforced){
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
    },
    'check_content_pkg':function(content_pkg_map){
        if(_mod_utilities.isMap(content_pkg_map)){
            return
                'text' in content_pkg_map &&
                'image' in content_pkg_map;
        }else
            return false
    }
}

const _mod_element_replacers = {
    'txt_appl':function(element, replacement){
        element.innerHTML = replacement.text;
    },
    
    'img_appl':function(element, replacement_img){
        element.src = replacement_img.image;
    },
    
    'bkg_appl':function(element, replacement_img){
        element.style.backgroundImage = "url(\"" + replacement_img['image'] + "\")"
    }
}

const _mod_modpack_handlers = {
    //Expecting a (object) map of functions.
    'option':function(value){
        if(_mod_utilities.isMap(value)){
            for(var i = 0; i < Object.keys(value).length; i++){
                if(!(Object.keys(value)[i] in _mod_options_modifiers)){
                    _mod_options_modifiers[Object.keys(value)[i]] = value[Object.keys(value)[i]];
                    console.info("Injected new option: " + Object.keys(value)[i]);
                }
            }
            return true;
        }else{
            return false;
        }
    },

    'content_pkg':function(value){
        if(_mod_utilities.isMap(value)){
            if(!_mod_utilities.check_content_pkg(value[Object.keys(value)[0]])){
                if(!(Object.keys(value)[0] in packages)){
                    packages[Object.keys(value)[0]] = value[Object.keys(value)[0]];
                    console.info("Inserted content package element, Key: " + Object.keys(value)[0] + ", Value: "
                                     + value[Object.keys(value)[0]]);
                    return true;
                }else{
                    log("Overlapping content package element: " + Object.keys(value)[0]);
                    return false;
                }

            }else{
                console.error("Invalid content package map");
                return false;
            }
        }else{
            return false;
        }
    },

    'option_modifier':function(value){
        if(_mod_utilities.isMap(value)){
            for(var i = 0; i < Object.keys(value).length; i++){
                //Key: Object.keys(value)[i], Value: value[Object.keys(value)[i]]
                if(!_mod_utilities.type_check(value[Object.keys(value)[i]], 'function')){
                    console.warn("Option package element type invalid, cannot import.");
                }else{
                    if(!(Object.keys(value)[i] in _mod_options_modifiers)){
                        _mod_options_modifiers[Object.keys(value)] = value[Object.keys(value)[i]];
                        console.info("Inserted option package element, Key: " + Object.keys(value)[i] + ", Value: "
                                     + value[Object.keys(value)[i]]);
                    }else{
                        log("Overlapping option package element: " + Object.keys(value)[i])
                    }
                }
            }
            return true;
        }else{
            return false;
        }
    },

    'element_manipulator':function(value){
        if(_mod_utilities.isMap(value)){
            for(var i = 0; i < Object.keys(value).length; i++){
                //Key: Object.keys(value)[i], Value: value[Object.keys(value)[i]]
                if(!_mod_utilities.type_check(value[Object.keys(value)[i]], 'function')){
                    console.warn("Manipulator package element type invalid, cannot import.");
                }else{
                    if(!(Object.keys(value)[i] in _mod_element_replacers)){
                        _mod_element_replacers[Object.keys(value)] = value[Object.keys(value)[i]];
                        console.info("Inserted manipulator package element, Key: " + Object.keys(value)[i] + ", Value: "
                                     + value[Object.keys(value)[i]]);
                    }else{
                        log("Overlapping manipulator package element: " + Object.keys(value)[i])
                    }
                }
            }
            return true;
        }else{
            return false;
        }
    }
}
