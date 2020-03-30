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
                res.body.should.have.length(1);
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
                res.body.should.have.all.keys('description', 'location', '_id', 'name', 'capacity', 'startDate', 'endDate', 'bookings');
                res.body.should.have.property('description').eql('');
                res.body.should.have.property('location').eql('');
                res.body.should.have.property('_id').eql(res.body._id, eventId);
                res.body.should.have.property('name').eql('Test Event');
                res.body.should.have.property('capacity').eql(10);
                res.body.should.have.property('bookings');
                res.body.bookings[0].should.be.a('string');
                done();
            });
    });

    it("POST /api/v1/events", function(done) {
        let newTestEvent = {name: "Bday", description: "A Bday partayyy", location: "Reykjavik", capacity: 4, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: []};
        chai.request(apiUrl)
            .post('/api/v1/events/')
            .set('content-type', 'application/json')
            .send(newTestEvent)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name').eql(newTestEvent.name);
                res.body.should.have.property('description').eql(newTestEvent.description);
                res.body.should.have.property('location').eql(newTestEvent.location);
                res.body.should.have.property('capacity').eql(newTestEvent.capacity);
                res.body.should.have.property('startDate').eql(newTestEvent.startDate);
                res.body.should.have.property('endDate').eql(newTestEvent.endDate);
                res.body.should.have.property('bookings').eql(newTestEvent.bookings);
                Object.keys(res.body).length.should.be.eql(8);
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
                res.body.should.have.length(1);
                done();
            });
    });

    it("GET /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .get('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.all.keys('tel', 'email', '_id', 'firstName', 'lastName', 'spots');
                res.body.should.have.property('tel').eql('');
                res.body.should.have.property('email').eql('jane@doe.com');
                res.body.should.have.property('_id').eql(res.body._id, bookingId);
                res.body.should.have.property('firstName').eql('Jane');
                res.body.should.have.property('lastName').eql('Doe');
                res.body.should.have.property('spots').eql(2);
                done();
            });
    });

    it("POST /api/v1/events/:eventId/bookings", function(done) {
        let ntb = {firstName: "Thelma", lastName: "Ólafsdóttir", tel: "8945784", email: "thelma@doe.com", spots: 4};
        chai.request(apiUrl)
            .post('/api/v1/events/' + eventId + '/bookings')
            .set('content-type', 'application/json')
            .send(newTestBooking)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('firstName').eql(ntb.firstName);
                res.body.should.have.property('lastName').eql(ntb.lastName);
                res.body.should.have.property('tel').eql(ntb.tel);
                res.body.should.have.property('email').eql(ntb.email);
                res.body.should.have.property('spots').eql(ntb.spots);
                Object.keys(res.body).length.should.be.eql(6);
                done();
            });
    });

    //Endpoint tests to DELETE individual booking, success and failure.
    
    //Success case!
    it("DELETE /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .delete('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .auth('admin', 'secret')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('tel').eql('');
                res.body.should.have.property('email').eql('jane@doe.com');
                res.body.should.have.property('_id').eql(res.body._id, bookingId);
                res.body.should.have.property('firstName').eql('Jane');
                res.body.should.have.property('lastName').eql('Doe');
                res.body.should.have.property('spots').eql(2);
                done();
            });
    });

    //Failure case!
    it("DELETE /api/v1/events/:eventId/bookings/:bookingId", function(done) {
        chai.request(apiUrl)
            .delete('/api/v1/events/' + eventId + '/bookings/' + bookingId)
            .auth('wrong', 'wrong2')
            .end((err, res) => {
                res.should.not.have.status(200);
                done();
            });
    });
});