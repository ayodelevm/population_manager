import supertest from 'supertest';
import should from 'should';
import app from '../app';
import models from '../models';
import * as seeds from './../seeders';
import { createLocation } from '../controllers';

const server = supertest.agent(app);

before((done) => {
  models.sequelize.sync({ force: true }).then(() => {
    return models.sequelize.queryInterface.bulkInsert('Locations', seeds.initialLocations)
  })
  .then(() => {
    done(null);
  })
  .catch((errors) => {
    done(errors);
  });
})

describe('Population Manager App', () => {
  let token;
  it('allows creation of a new location', (done) => {
    server
      .post('/api/v1/location')
      .send(seeds.createLocation)
      .end((err, res) => {
        res.status.should.equal(201);
        res.body.message.should.equal('New location added successfully!');
        done();
      });
  });

  it('ensures that name of location is unique', (done) => {
    server
      .post('/api/v1/location')
      .send(seeds.createLocation)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.name.should.equal('name is not available');
        done();
      });
  });

  it('prevents adding a location with empty details', (done) => {
    server
      .post('/api/v1/location')
      .send(seeds.emptyLocation)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.name.should.equal('This field is required');
        res.body.errors.maleResidents.should.equal('This field is required');
        res.body.errors.femaleResidents.should.equal('This field is required');
        done();
      });
  });

  it('prevents adding non-coercible strings or floats as values for male and female residents', (done) => {
    server
      .post('/api/v1/location')
      .send(seeds.invalidLocation)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.maleResidents.should.equal('Value must be an integer');
        res.body.errors.femaleResidents.should.equal('Value must be an integer');
        done();
      });
  });

  it('allows a user to update a location', (done) => {
    server
      .put(`/api/v1/location/${seeds.createLocation.id}`)
      .send({ maleResidents: 54 })
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.updatedFields.maleResidents.should.equal(54);
        res.body.updatedFields.femaleResidents.should.equal(33);
        res.body.updatedFields.name.should.equal('Port-Harcourt');
        res.body.message.should.equal('Location updated successfully');
        done();
      });
  });

  it('should prevent updating a location that does not exist as contact', (done) => {
    server
      .put(`/api/v1/location/${seeds.locationNotInDB.id}`)
      .send({ maleResidents: 54 })
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('location not found!');
        done();
      });
  });

  it('allows the retrieval of a location', (done) => {
    server
      .get(`/api/v1/location/${seeds.createLocation.id}`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('location retrieved successfully');
        res.body.foundLocation.length.should.equal(1);
        done();
      });
  });

  it('prevents retrieval of a location that does not exist', (done) => {
    server
      .get(`/api/v1/location/${seeds.locationNotInDB.id}`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('location not found!');
        done();
      });
  });

  it('allows the retreival of all locations successfully', (done) => {
    server
      .get(`/api/v1/locations`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('All locations retrieved successfully');
        res.body.allLocations.length.should.equal(5);
        done();
      });
  });

  it('allows a location to be deleted successfully', (done) => {
    server
      .delete(`/api/v1/location/${seeds.initialLocations[0].id}/`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Location deleted successfully');
        done();
      });
  });

  it('prevents a location that does not exist from being deleted', (done) => {
    server
      .delete(`/api/v1/location/${seeds.locationNotInDB.id}/`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('location not found!');
        done();
      });
  });
});

