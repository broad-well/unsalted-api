# unsalted-api
A JavaScript API that can change everything on a webpage to anything.
 ***

### Obtain
It's easy to implement this API on your webpage. Insert this script to that webpage to do so:
```html
<script defer src="https://cdn.rawgit.com/michaelpeng2002/unsalted-api/master/unsalted_api.js" type="application/javascript"></script>
```

It's also possible to inject this API into a loaded webpage. _This code may not work for sites with Content Security Policy._ To do so, execute these lines on a JavaScript console in the browser:
```javascript
var script = document.createElement('script');
script.type = "text/javascript";
script.src = "https://cdn.rawgit.com/michaelpeng2002/unsalted-api/master/unsalted_api.js";
document.head.appendChild(script)
```

