var UnsaltedAPI = (function() {
    
  const Logger = {
    LogLevel: 2,
    Prefix: 'UnsaltedApi',
    log: function(string, level) {
      level = level ? level : 1;
      if (level <= this.LogLevel) {
        console.log(this.Prefix + ": " + string);
      }
    }
  }

  const ModuleManager = {
    required_keys: ['preferences', 'functions', 'name', 'version', 'runtime', 'attributes'],
    arrays: ['attributes', 'runtime'],
    modules: [],

    validate: function(module_obj) {
      //Check required_keys
      for (let key of this.required_keys) {
        if (!Object.keys(module_obj).includes(key)) {
          Logger.log('Module validation failed, key not in object: ' + key);
          return false;
        }
      }

      //Check types
      for (let key of this.arrays) {
        if (!Array.isArray(module_obj[key])) {
          Logger.log('Module validation failed, key value not an array: ' + module_obj[key])
          return false;
        }
      }

      return true;
    },

    getByProperty: function(property, value){
      for(let item of this.modules){
        if(item[property] === value){
          return item
        }
      }
      return undefined
    },

    load: function(mod) {
      if (this.validate(mod)) {
        if (this.getByProperty('name', mod.name) === undefined) {
          this.modules.push(mod)
          Logger.log("Module load successful; " + mod);
          return true;
        } else {
          Logger.log("Module load aborted, duplicate existence")
          return false;
        }
      } else {
        Logger.log("Module load aborted, validation failed")
        return false;
      }
    },

    list: function() {
      console.log("- lsmod (Module Listing) output -")
      for (let i of this.modules) {
        console.log(i.name + ", v" + i.version)
      }
      console.log("- lsmod (Module Listing) finished -")
    },

    info: function(name) {
      if (this.getByProperty('name', name) === undefined) {
        Logger.log("Module information aborted, module not loaded")
        return false;
      } else {
        var mod = this.getByProperty('name', name)
        console.log("--- Information of " + mod.name + " ---")
        for (let item of Object.keys(mod)) {
          console.log(item + ": " + mod[item])
        }
        console.log("--- Information finished ---");
        return true;
      }
    },

    selfCheck: function() {
      // Not implemented yet
      return true;
    },

    unload: function(modname) {
      if(this.getByProperty('name', modname) === undefined){
        Logger.log("Module unload aborted - module does not exist")
        return false;
      }else{
        if(this.getByProperty('name', modname).attributes.includes('static')){
          Logger.log("Module unload aborted - module not swappable")
          return false;
        }else{
          this.modules.pop(this.getByProperty('name', modname))
          Logger.log("Unloaded module " + modname)
          return true;
        }
      }
    }
  }

  // ---- Standard Unswappable modules ----
  
  ModuleManager.load({
    name: 'PackageManager',
    version: 0.01,
    runtime: [],
    attributes: ['static'],
    preferences: {
      readonly: false,
        activePackage: undefined
    },
    functions: {
        insert: function(name, package){
            if(!Object.keys(ModuleManager.getByProperty('name', 'PackageManager').packages).includes(name) && !ModuleManager.getByProperty('name', 'PackageManager').preferences.readonly){
                ModuleManager.getByProperty('name', 'PackageManager').packages[name] = package;
                return true;
            }else return false;
        },
        
        delete: function(name){
            if(Object.keys(ModuleManager.getByProperty('name', 'PackageManager').packages).includes(name) && !ModuleManager.getByProperty('name', 'PackageManager').preferences.readonly){
                delete ModuleManager.getByProperty('name', 'PackageManager').packages[name];
                return true;
            }else return false;
        },
        
        setPackage: function(name){
            if(Object.keys(ModuleManager.getByProperty('name', 'PackageManager').packages).includes(name)){
                ModuleManager.getByProperty('name', 'PackageManager').preferences.activePackage = ModuleManager.getByProperty('name', 'PackageManager').packages[name];
                return true;
            }else return false;
        }
    },
      packages: {
          usp: {
              text: 'Unsalted Peanuts',
              image: 'http://www.priorityhealth.com.au/productimages/BB3410.jpg',
              background: 'https://s-media-cache-ak0.pinimg.com/736x/9d/84/e1/9d84e161c3e6482d47c050cffc305c7e.jpg'
          },
          
          trump: {
              text: 'Donald Trump',
              image: 'http://pixel.nymag.com/imgs/daily/intelligencer/2015/08/10/10-donald-trump-debate.w750.h560.2x.jpg',
              background: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Donald_Trump_by_Gage_Skidmore.jpg/99px-Donald_Trump_by_Gage_Skidmore.jpg'
          }
      }
  })


  ModuleManager.load({
      name: 'ReplacementExecutor',
      version: 0.01,
      runtime: ['onReplace'],
      attributes: ['static'],
      preferences: {
          
      },
      functions: {
          invoke: function(){
                  for(i of Object.keys(ModuleManager.getByProperty('name', 'ReplacementExecutor').resources)){
                      ModuleManager.getByProperty('name', 'ReplacementExecutor').resources[i].invoke();
                  }
              
          }
      },
      resources: {
          text: {
              invoke: function() {
                  for(item of this.resources.textElements){
                      item.innerHTML = ModuleManager.getByProperty('name', 'PackageManager').preferences.activePackage.text;
                      Logger.log("Replaced text element " + item);
                  }
              },
              resources: {
                  textElements: (function(){
                      var allElements = document.getElementsByTagName('*');
                      var replaceable = [];
                      for(var i = 0; i < allElements.length; i++){
                          if(allElements[i].tagName !== "style" &&
                             allElements[i].tagName !== "script" &&
                             allElements[i].children.length === 0){
                              replaceable.push(allElements[i]);
                          }
                      }
                      delete allElements;
                      return replaceable;
                  }())
              }
          },
          
          image: {
              invoke: function() {
                  for(item of this.resources.imageElements){
                      item.src = ModuleManager.getByProperty('name', 'PackageManager').preferences.activePackage.image;
                      Logger.log("Replaced image element " + item);
                  }
              },
              resources: {
                  imageElements: (function(){
                      return [].slice.call(document.getElementsByTagName("img"));
                  }())
              }
          },
          
          background: {
              invoke: function() {
                  for(item of this.resources.elements){
                      item.style.backgroundImage = ModuleManager.getByProperty('name', 'PackageManager').preferences.activePackage.background;
                  }
              },
              resources: {
                  elements: document.getElementsByTagName('*')
              }
          }
      }
  });

  return {

    //Alias for unsaltify(...().
    

    unsaltify: function(package) {
      if(ModuleManager.getByProperty('name', 'PackageManager').functions.setPackage(package)){
          ModuleManager.getByProperty('name', 'ReplacementExecutor').functions.invoke();
      }else{
          console.log("This package does not exist: " + package);
      }
    },
      usp: function(p) {
      return this.unsaltify(p);
    },
      
      ModMan: ModuleManager
  }
  
}())