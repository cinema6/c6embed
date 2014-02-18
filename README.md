stub
====

Stub project for initializing a Cinema6 Angular project.  This will seed an Angular web-app organized to fit into the overall site architecture.  It uses Grunt to run common development and build processes.

Steps for starting a new project using stub
-------------------------------------------

  1. Make sure the following dependencies are installed: Node.js, git
     and java (required for E2E tunneling sessions.)

  2. Install "create-ng-app"

    ```bash
    $> sudo npm install -g git+ssh://git@bitbucket.org:cinema6/create-ng-app.git
    ```

  3. Run the create-ng-app tool.

    ```bash
    $> create-ng-app desired/path/to/app
    ```

  4. Setup with Github
  
    ```bash
    $> cd desired/path/to/app
    $> git remote add origin git@github.com:cinema6/myawesomeapp.git
    ```
    
  5. Add the files in the repo (make sure to include the .c6stubinit file)
  
  6. Push to Github!
  
    ```bash
    $> git push origin master -u
    ```

### Grunt Tasks and Configuration
#### Configuration
##### .aws.json
This file should be stored in a location where it can be accessed by many applications (usually your home directory.) It should have the following properties:

1. accessKeyId
2. secretAccessKey
3. region

##### .saucelabs.json
This file should be stored in a location where it can be accessed by many applications (usually your home directory.) It should have the following properties:

1. user
2. key

#### package.json
The name and keywords in this file are used to configure certain application settings and defaults. For example, when executing E2E tests on SauceLabs, the name of the job will be the "name" property in this file, and the job tags will be the "keywords" array in this file.

##### settings.json
This file contains the application settings that are used accross grunt tasks and in automated testing. You can run
```bash
$> grunt init
```
to run a wizard that will walk you through configuring this file.

###### appUrl
This property configures the url that the sandbox should iframe in to load your application.

###### appModule
The main Angular module name for your application.

###### appDir
The folder that houses your application.

###### distDir
The folder into which grunt should build the application.

###### awsJSON
The path (relative to your home directory) of your .aws.json file.

###### saucelabsJSON
The path (relative to your home directory) of your .saucelabs.json file.

###### browserstackJSON
The path (relative to your home directory) of your .browserstack.json file.

###### sandboxPort
The port on which to run the development server.

###### collateralDir
The directory where collateral assets will be stored. This folder will be created for you the first time an experience is created.

###### experiencesJSON
The location of experiences.json file that the sandbox will use to drive your application. This file will be created for you the first time you create an experience.

###### libUrl
The URL prefix used to resolve 3rd-party libraries in unit tests.

###### defaultE2EEnv
The default E2E environment in which to run when no environment is passed to the ````grunt:test:e2e```` task. Valid values are "saucelabs", "browserstack" or "local".

###### s3.test.bucket
The S3 bucket used for testing.

###### s3.test.collateral
The collateral asset upload location for testing.

###### s3.test.app
The app upload location for testing.

###### s3.production.bucket
The S3 bucket used for production.

###### s3.production.collateral
The collateral asset upload location for production.

###### s3.production.app
The app upload location for production.

#### Tasks
##### init
This task guides you through configuring your new application. You should only need to run this once when setting up your app for the first time.

ex:
```bash
$> grunt init
```

##### createexp
This task guides you through creating an experience object. While some apps will only have one experience, if your app can run many experiences, this task will be helpful!

ex:
```bash
$> grunt createexp
```

##### genid:(prefix)
This task will generate and log a Cinema6-formatted UUID with the supplied prefix.

ex:
```bash
$> grunt genid:e
Running "genid:e" (genid) task
e-6c7ed80e3d68ac
$> grunt genid:o
Running "genid:o" (genid) task
o-df80d6438ab29c
```

##### updatelib:(target):(lib || *undefined*):(version || *undefined*)
This task is configured with one target, app, which will update the index.html and main.js files with the most recent (or specified) lib/libs that are available on S3.

ex:
```bash
$> grunt updatelib #upgrade all libs to the most recent version
$> grunt updatelib:app:c6ui #upgrade c6ui to the most recent version
$> grunt updatelib:app:gsap:1.11.2 # upgrade GSAP to version 1.11.2
```

##### server
This task will start a development server that uses the c6-sandbox. Your application will appear inside the Cinema6 site chrome, and the Cinema6 site API will be available.

ex:
```bash
$> grunt server
```

##### test:unit
This task will check your JS files for lint and execute the unit tests

ex:
```bash
$> grunt test:unit
```

##### test:unit:debug
This task will watch your JS files for changes. If a file is changed, the unit tests will be re-executed.

ex:
```bash
$> grunt test:unit:debug
```

##### test:e2e:(browser || 'all'):(env || *undefined*)
This task will execute the E2E tests on the environment of your choice (or in the environment specified in settings.json if none is supplied) in the specified browser, or in all browsers if "all" is supplied.

ex:
```bash
$> grunt test:e2e:chrome #Run E2E tests in Chrome in default env
$> grunt test:e2e:ie:local #Run E2E tests in IE locally
$> grunt test:e2e:all:browserstack #Run E2E tests in all browsers on BrowserStack
```

##### test:e2e:debug:(browser)
This task will watch your app and test files and run the E2E tests locally in the specified browser when any of the files change.

ex:
```bash
$> grunt test:e2e:debug:iphone
```

##### test
This task will execute all unit and E2E tests. E2E tests will run in all browsers in the derfault environment.

ex:
```bash
$> grunt test
```

##### publish:collateral:('test' || 'production')
This task will build and upload the collateral assets to the specified environment on S3.

ex:
```bash
$> grunt publish:collateral:test #Upload collateral assets to test server
$> grunt publish:collateral:production #Upload collateral assets to production server
```

##### publish:app:('test' || 'production')
This task will build and upload the application to the specified environment on S3.

ex:
```bash
$> grunt publish:app:test #Upload app to test server
$> grunt publish:app:production #Upload app to production server
```

##### publish:('test' || 'production')
This task will build and upload the collateral assets and app to the specified environment on S3.

ex:
```bash
$> grunt publish:test #Upload collateral assets and app to test server
$> grunt publish:production #Upload collateral assets and app to production server
```
