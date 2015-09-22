PhoneGap Sample App - ReactJS
==============================================
This sample app is an iTunes Media Finder app built with ReactJS and [TouchstoneJS](http://touchstone.io). TouchstoneJS is a mobile UI framework built on top of 
ReactJS/HTML5/CSS3 and Cordova. The sample allows you to search for songs, music videos or movies and preview them or open a result in iTunes.
 
[SEE DETAILED BLOG POST HERE](http://devgirl.org/2015/09/22/sample-phonegap-app-with-reactjs/) 

![](resources/screenshots/search.png)
![](resources/screenshots/results.png)
![](resources/screenshots/details.png)
![](resources/screenshots/spinner.png)

### Built with
1. ReactJS
2. TouchstoneJS
3. HTML5
4. CSS3
5. Cordova


### Demo
You can try this sample out quickly in the web app version located [here](http://devgirl.org/files/phonegap-react/). Enter the desired search term  
and criteria, then click **Show Results** to query the iTunes Search API.   


### Quick Start
1. Create a phonegap project using the [PhoneGap Desktop Application](https://github.com/phonegap/phonegap-app-desktop) or the PhoneGap CLI  
    `$ phonegap create myApp`
2. Clone/download this project 
3. Copy in the following from the PhoneGap React Sample into to your newly created project (overwrite the existing)
  - `www` folder 
  - `config.xml` file 
  - `resources` folder for the custom icons and splash screens to be used.   
4. Start the server for your app using the PhoneGap CLI ((`$ phonegap serve`) or [PhoneGap Desktop Application](https://github.com/phonegap/phonegap-app-desktop) 
5. Open the PhoneGap Developer app on your mobile device (available from app stores) and connect to the IP Address your app was served on. 

See the [PhoneGap Docs Quick Start](http://docs.phonegap.com/getting-started/2-install-mobile-app/) for more details on this process.
 
 
## Build Locally
To build and preview locally, install the node dependences (`$ npm install`) and run the `gulp dev` task. It will build the app with 
browserify, create the cordova assets (www folder etc) for mobile and start a preview server at [localhost:8000](http://localhost:8000).
 
1. `npm install`
2.  `gulp dev`
3. Open your browser to http://localhost:8000

Once you've run `gulp dev` you can run the app on a mobile device by building/running using the PhoneGap or Cordova CLI. Live reload will not work when running directling
with the CLI unless you just serve the app with it and pair/connect using the PhoneGap Developer app on your device. Details on how to do this can be found in the 
[PhoneGap Docs Quick Start](http://docs.phonegap.com/getting-started/2-install-mobile-app/).

### PhoneGap CLI Instructions
1. `gulp dev`
3. `phonegap run ios` (or `phonegap run android`)

### Cordova CLI Instructions
1. `gulp dev`
2. `cordova platform add ios (or cordova platform add android)` 
3. `cordova run` 

![](resources/screenshots/splash.png)
![](resources/screenshots/search.png)
![](resources/screenshots/spinner.png)
![](resources/screenshots/results.png)
![](resources/screenshots/prefs.png)
![](resources/screenshots/about.png)

### Select Control Issue 
- If you build locally, you may find an issue with the select control use for selecting the media type (song, music video, movie), where it doesn't 
select it properly. This is due to an issue with the version of the `LabelSelect` source that is currently being retrieved from TouchstoneJS in npm.
To fix it, you can either get the latest TouchstoneJS project clone and `npm link` to that instead, or use the code in the LabelSelectFix.js 
source file in the root of this sample project. Simply replace the contents of LabelSelect.js located at `<your-project>/node_modules/touchstonejs/ui/LabelSelect.js` 
with the contents in LabelSelectFix.js.  

###Plugins
The plugin dependencies will be fetched and added by the PhoneGap/Cordova CLI for you upon adding the platforms since they are specified in the config.xml.
However, you can check to see if they've been added by running: 

  `$ phonegap plugin list` or `$ cordova plugin list` 
  
**Plugins Required**
1. cordova-plugin-whitelist  
2. cordova-plugin-device
3. cordova-plugin-statusbar
4. cordova-plugin-splashscreen
5. cordova-plugin-console
6. cordova-plugin-inappbrowser
  
You can manually add them with the CLI:
 
 `$ cordova plugin add cordova-plugin-whitelist`

or 

 `$ phonegap plugin add cordova-plugin-whitelist`