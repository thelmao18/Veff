const express = require('express');

const app = express();
const apiPath = '/api/';
const version = 'v1';
const port = 3000;

const bodyParser = require('body-parser');
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

//Read all events
app.get(apiPath + version + '/events', (req, res) => {
    let ret_arr = [];
    for (let i=0;i<events.length;i++) {
        ret_arr.push({id: events[i].id, name: events[i].name, capacity: events[i].capacity, startDate: events[i].startDate, endDate: events[i].endDate});
    }
    res.status(200).json(ret_arr);
})

//Read an individual event

//Create a new event

//Update an event

//Delete an event

//Delete all events


//The endpoints for bookings

//Read all bookings for an event

//Read an individual booking

//Create a new booking

//Delete a booking

//Delete all bookings for an event