//Importing the application to test
let server = require('../index');
let mongoose = require("mongoose");
let Event = require('../models/event');
let Booking = require('../models/booking');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let apiUrl = "http://localhost:3000";

describe('Endpoint tests', () => {
    //###########################
    //These variables contain the ids of the existing event/booking
    //That way, you can use them in your tests (e.g., to get all bookings for an event)
    //###########################
    let eventId = '';
    let bookingId = '';

    //###########################
    //The beforeEach function makes sure that before each test, 
    //there is exactly one event and one booking (for the existing event).
    //The ids of both are stored in eventId and bookingId
    //###########################
    beforeEach((done) => {
        let event = new Event({ name: "Test Event", capacity: 10, startDate: 1590840000000, endDate: 1590854400000});

        Event.deleteMany({}, (err) => {
            Booking.deleteMany({}, (err) => {
                event.save((err, ev) => {
                    let booking = new Booking({ eventId: ev._id, firstName: "Jane", lastName: "Doe", email: "jane@doe.com", spots: 2 });
                    booking.save((err, book) => {
                        eventId = ev._id;
                        bookingId = book._id;
                        done();
                    });
                });
            });
        });
    });

    //###########################
    //Write your tests below here
    //###########################

    it("should always pass", function() {
        console.log("Our event has id " + eventId);
        console.log("Our booking has id " + bookingId);
        chai.expect(1).to.equal(1);
    });

    //Regular endpoint tests, all success cases.

    it("GET /api/v1/events", function(done) {
        chai.request(apiUrl)
            .get('/api/v1/events/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
        });
    });

    it("GET /api/v1/events/:eventId", function(done) {
        chai.request(apiUrl)
            .get('/api/v1/events/' + eventId)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });

    it("POST /api/v1/events", function(done) {
        let newTestEvent = {}
        chai.request(apiUrl)
            .post('/api/v1/events/')
            .set('content-type', 'application/json')
            .send()
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
    });

    it("GET /api/v1/events/:eventId/bookings", function(done) {
        chai.request(apiUrl)
            .get('/api/v1/events/' + eventId + '/bookings')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });

    it("GET /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .get('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it("POST /api/v1/events/:eventId/bookings", function(done) {
        chai.request(apiUrl)
            .post('/api/v1/events/' + eventId + '/bookings')
            .set('content-type', 'application/json')
            .send()
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
    });

    //Endpoint tests to DELETE individual booking, success and failure.
    
    //Success case!
    it("DELETE /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .delete('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    //Failure case!
    it("DELETE /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .delete('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});