import express from 'express';
import * as Controllers from '../controllers';

const routers = express.Router();

routers.post('/api/v1/location', Controllers.createLocation());

routers.get('/api/v1/location/:locationId', Controllers.getOneLocation());

routers.get('/api/v1/locations', Controllers.getAllLocations());

routers.put('/api/v1/location/:locationId', Controllers.updateALocation());

routers.delete('/api/v1/location/:locationId', Controllers.deleteAlocation());

export default routers;
