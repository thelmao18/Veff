//Import express
const express = require('express');

//Initialize express
const app = express();

//URL
const apiPath = '/api/';
const version = 'v1';
const port = 3000;

//Import a body parser to access the requests as json
const bodyParser = require('body-parser');
//Make express use the body parser
app.use(bodyParser.json());

//Sample data for Assignment 3

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5}
];

//The endpoints for events

//Read all events #1
app.get(apiPath + version + '/events', (req, res) => {
    let ret_arr = [];
    for (let i = 0; i < events.length; i++) {
        ret_arr.push({id: events[i].id, name: events[i].name, capacity: events[i].capacity, startDate: events[i].startDate, endDate: events[i].endDate});
    }
    res.status(200).json(ret_arr);
});

//Read an individual event #2
app.get(apiPath + version + '/events/:eventId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            return res.status(200).json(events[i]);
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Create a new event #3
app.post(apiPath + version + '/events', (req, res) => {
    res.status(201).send('Hello World');
});

//Update an event #4
app.put(apiPath + version + '/events/:eventId', (req, res) => {
    res.status(200).send('Hello World');
});

//Delete an event #5
app.delete(apiPath + version + '/events/:eventId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            var ret_arr = events.slice(i, 1);
            return res.status(200).json(ret_arr);
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Delete all events #6
app.delete(apiPath + version + '/events', (req, res) => {
    var ret_arr = events.slice();
    events = [];
    for (let i = 0; i < ret_arr.length; i++) {
        let eventBookings = ret_arr[i].bookings.slice();
        ret_arr[i].bookings = [];
        for (let x = bookings.length - 1; x >= 0; x--) {
            if (eventBookings.includes(bookings[x].id)) {
                ret_arr[i].bookings.push(bookings.splice(x, 1));
            }
        }
    }
    res.status(200).json(ret_arr);
});

//The endpoints for bookings

//Read all bookings for an event #7
app.get(apiPath + version + '/events/:eventId/bookings', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            let ret_arr = [];
            for (let x = 0; x < bookings.length; x++) {
                if (events[i].bookings.includes(bookings[x].id)) {
                    ret_arr.push(bookings[x]);
                }
            }
            return res.status(200).json(ret_arr);
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Read an individual booking #8
app.get(apiPath + version + '/events/:eventId/bookings/:bookingId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            for (let x = 0; x < bookings.length; x++) {
                if (bookings[x].id == req.params.bookingId) {
                    return res.status(200).json(bookings[x]);
                }
            }
            res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist."});
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Create a new booking #9
app.post(apiPath + version + '/events/:eventId/bookings', (req, res) => {
    res.status(201).send('Hello World');
});

//Delete a booking #10
app.delete(apiPath + version + '/events/:eventId/bookings/:bookingId', (req, res) => {
    res.status(200).send('Hello World');
});

//Delete all bookings for an event #11
app.delete(apiPath + version + '/events/:eventId/bookings', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            var ret_arr = bookings.slice();
            events[i].bookings = [];
            return res.status(200).json(ret_arr);
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//If not right URL given or endpoint does not exist, then send error message.
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported!');
});

//Start the application.
app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});