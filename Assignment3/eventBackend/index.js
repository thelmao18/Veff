//Import express
const express = require('express');

//Initialize express
const app = express();

//URL
const apiPath = '/api/';
const version = 'v1';
const port = process.env.PORT || 3000;

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

let bookingCounter = bookings.length
let eventCounter = events.length

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
    if (req.body === undefined || req.body.name === undefined || req.body.capacity === undefined || req.body.startDate === undefined || req.body.endDate === undefined) {
        return res.status(400).json({'message': "Name, capacity, startDate and endDate are required in the request body!"});
    }
    else {
        let nextEventId = eventCounter;
        eventCounter += 1
        if (isNaN(Number(req.body.capacity)) || Number(req.body.capacity) <= 0) {
            return res.status(400).json({'message': "Capacity has to be a number that is larger or equal to 0!"});
        }
        if (isNaN(Number(req.body.startDate)) || isNaN(Number(req.body.endDate))) {
            return res.status(400).json({'message': "Invalid date string"});
        }
        if(req.body.startDate > req.body.endDate){
            return res.status(400).json({'message': "Start date can't be after end date"});
        }
        if(Date.now() > new Date(req.body.startDate * 1000)){
            return res.status(400).json({'message': "Start date can't be set in the past"});
        }
        if (req.body.description === undefined){
            req.body.description = ""
        }
        if (req.body.location === undefined){
            req.body.location = ""
        }
        let newEvent = {id: nextEventId, name: req.body.name, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: new Date(req.body.startDate * 1000), endDate: new Date(req.body.endDate * 1000), bookings: []};
        events.push(newEvent);
        return res.status(201).json(newEvent);
    }
});

//Update an event #4
app.put(apiPath + version + '/events/:eventId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            for (let x = 0; x < bookings.length; x++) {
                if (!events[i].bookings.includes(bookings[x].id)) {
                    let updatedEvent = {id: events[i].id, name: req.body.name, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: new Date(req.body.startDate * 1000), endDate: new Date(req.body.endDate * 1000), bookings: []};
                    events[i] = updatedEvent;
                    return res.status(201).json(events[i]);
                }
            }
            return res.status(400).json({'message': "Event with id " + req.params.eventId + " has bookings and therefor cannot be updated."});
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Delete an event #5
app.delete(apiPath + version + '/events/:eventId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            for (let x = 0; x < bookings.length; x++) {
                if (!events[i].bookings.includes(bookings[x].id)) {
                    let ret_arr = events.splice(i, 1);
                    return res.status(200).json(ret_arr);
                }
            }
            return res.status(400).json({'message': "Event with id " + req.params.eventId + " has bookings and therefor cannot be deleted."});
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
    res.status(404).json({'message': "Event w   ith id " + req.params.eventId + " does not exist."});
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
            return res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist for this event."});
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});

//Create a new booking #9
app.post(apiPath + version + '/events/:eventId/bookings', (req, res) => {
    let numberOfSpotsTaken = req.body.spots;
    let eventCapacity = 0;
    if (req.body === undefined || req.body.firstName === undefined || req.body.lastName === undefined || (req.body.tel === undefined && req.body.email === undefined) || req.body.spots === undefined) {
        return res.status(400).json({'message': "First name, last name, telaphone or email and spots are required in the request body!"});
    }
    if (isNaN(Number(req.body.spots)) || Number(req.body.spots) <= 0) {
        return res.status(400).json({'message': "The number of spots cannot be NaN nor can they be a number equal to 0 or less."});
    }
    else {
        for (i = 0; i < events.length; i++){
            if (events[i].id == req.params.eventId){
                eventCapacity = events[i].capacity;
                for (let x = 0; x < events[i].bookings.length; x++){
                    for (let y = 0; y < bookings.length; y++){
                        if (bookings[y].id == events[i].bookings[x]){
                            numberOfSpotsTaken += bookings[y].spots;
                        }
                    }
                }
                }
            }
        }
        if (numberOfSpotsTaken > eventCapacity){
            return res.status(400).json({'message': 'Number of spots exceeds the event capacity'});
        }
        if (req.body.tel === undefined){
            req.body.tel = ""
        }
        if (req.body.email === undefined){
            req.body.email = ""
        }
        nextBookingsId = bookingCounter
        bookingCounter += 1
        let newBooking = {id: nextBookingsId, firstName: req.body.firstName, lastName: req.body.lastName, tel: req.body.tel, email: req.body.email, spots: req.body.spots};
        events[req.params.eventId].bookings.push(nextBookingsId);
        bookings.push(newBooking);
        return res.status(201).json(newBooking);
});

//Delete a booking #10
app.delete(apiPath + version + '/events/:eventId/bookings/:bookingId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            let isBInE = false;
            for (let x = 0; x < events[i].bookings.length; x++) {
                if (events[i].bookings[x] == req.params.bookingId) {
                    isBInE = true;
                    events[i].bookings.splice(x, 1);
                }
            }
            if (isBInE === false) {
                return res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist for this event."});
            }
            for (let x = 0; x < bookings.length; x++) {
                if (bookings[x].id == req.params.bookingId) {
                    let ret_arr = bookings.splice(x, 1);
                    return res.status(200).json(ret_arr);
                }
            }
            return res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist for this event."});
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
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