PhoneGap Sample App - iTunes Media Finder - Built with ReactJS/TouchstoneJS
============================================================================

TouchstoneJS Sample App for PhoneGap. An iTunes Media Finder - search for songs, movies or videos and preview them in app or open in iTunes. 

### Web Demo
Try it quick [here](http://devgirl.org/files/phonegap-react/)

![](resources/screenshots/search.png)
![](resources/screenshots/results.png)
![](resources/screenshots/details.png)

###Quick Start
1. Clone the project 
2. Create a phonegap project 
    `$ phonegap create myApp`
3. Replace the `www` folder and the `config.xml` file with the `www` folder and `config.xml` from my sample project cloned in step 1
4. *Serve* the app via the PhoneGap CLI (`$ phonegap serve`) or via PhoneGap Desktop
5. Consume the app with the PhoneGap Developer app on your mobile device

See the [PhoneGap Docs Quick Start](http://docs.phonegap.com/getting-started/2-install-mobile-app/) for more details on this process. 


### Build Locally
To build and preview locally, install the node dependences (`$ npm install`) and run the `gulp dev` task. It will build the app with 
browserify, create the cordova assets (www etc) folder for mobile and start a preview server at [localhost:8000](http://localhost:8000). 

###PhoneGap CLI Instructions
1. `gulp dev`
3. `phonegap run ios` (or `phonegap run android`)

###Cordova CLI Instructions
1. `gulp dev`
2. `cordova platform add ios (or cordova platform add android)` 
3. `cordova run` 

![](resources/screenshots/splash.png)
![](resources/screenshots/search.png)
![](resources/screenshots/results.png)
![](resources/screenshots/prefs.png)
![](resources/screenshots/about.png)
![](resources/screenshots/spinner.png)


###Plugins
The plugin dependencies should be fetched and added by the PhoneGap/Cordova CLI for you upon adding the platforms since they are specified in the config.xml.
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