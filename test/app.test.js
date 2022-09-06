const request = require("supertest"); 
var app = require('./../index').app;
it("should return Hello Test", function(done){
     
    request(app)
        .get("/api/")
        .expect('hi')
        .end(done);
});