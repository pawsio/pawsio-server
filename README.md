# pawsio-server
An IOT pet monitoring single page app server deployed on Heroku
[https://pawsio.herokuapp.com](https://pawsio.herokuapp.com)

<div align="center">
  <img src="https://s-media-cache-ak0.pinimg.com/564x/06/90/1d/06901d858bc68e61f0b23b123ee0db35.jpg">
</div>

### Built with

* MONGO
* Express
* AngularJS
* NodeJS
* Deployed with Heroku

### Authors

[Caitlin Araldi](https://github.com/caraldi),
[Chris Bruner](https://github.com/QuantumArchive),
[Nathan Hugon](https://github.com/nthugon),
[Michelle Srikhundonr](https://github.com/michellesri)

### Version 1.0.0 

Fully integrated front-end single page web application with RESTful API backend and a Mongo DB for data persistence

* Front end will allow new users signup with a new account or returning users to signin instead
* Users may then register a new pet to their account ( just dogs for now, sorry :/ )
* You may then register your IOT device with your pets name using our [IOT app source code](https://github.com/pawsio/pawsio-iot)
* As soon as the pet and IOT device has been registered, it will begin transmitting data using your local WIFI source

### Application Structure

There are three main API endpoints that perform our CRUD operations as shown in our main routes:

* url/api/users
    * endpoint used for verifying tokens, user signup and signin and where admins may delete users
* url/api/pets
    * endpoint for getting all pets related to a user, a specific pet by id or query string, adding pets, updating pets and removing them
* url/api/pet-snapshots
    * endpoint used for posting collected data from the IOT application, retrieving said data, giving it a name and deleting it as necessary

### Testing

Testing can be performed for our various database end2end routes and CRUD methods. If npm is installed with the following two commands:

```
$ npm run test
$ npm run test:watch
```

The first command will perform all test at once using mocha.
The second command will test and allow you retest your files as changes are made.

### Issues

Please feel free to submit issues on our [Github Account!](https://github.com/pawsio/pawsio-server/issues)

### License

MIT