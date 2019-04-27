import models from '../models';
import ValidatorClass from '../utils/validator';
import { errorFunction } from '../utils'
const { Op } = models.Sequelize;

export const createLocation = () => {
  return (req, res, next) => {
    const queryOptions = { name: req.body.name };
    const enums = ['name', 'maleResidents', 'femaleResidents'];

    return ValidatorClass.validateExistence('Location', queryOptions, enums, req.body)
    .then(({ isValid, errors }) => {
      if (!isValid) throw errors;

      return models.Location.create({ ...req.body }, {
        fields: [...enums, 'id']
      })
    })
    .then(createdLocation => res.status(201).json({
      createdLocation,
      message: 'New location added successfully!'
    }))
    .catch(error => next(error))
  }
}

export const getOneLocation = () => {
  return (req, res, next) => {
    const query = 'SELECT *, sum("Locations"."maleResidents" + "Locations"."femaleResidents") AS total_residents FROM "public"."Locations" WHERE "Locations"."id"=:locationId GROUP BY "Locations"."id"';
    const options = {
      model: models.Location,
      type: models.sequelize.QueryTypes.SELECT,
      replacements: {
        locationId: req.params.locationId,
      },
    };
    return models.sequelize.query(query, options)
    .then((foundLocation) => {
      if (!foundLocation.length) throw errorFunction('location not found!', 404);
      return res.status(200).json({
        foundLocation,
        message: 'location retrieved successfully',
      })
    })
    .catch(error => next(error))
  }
}

export const getAllLocations= () => {
  return (req, res, next) => {
    const query = 'SELECT *, sum("Locations"."maleResidents" + "Locations"."femaleResidents") AS total_residents FROM "public"."Locations" GROUP BY "Locations"."id"';
    const options = {
      model: models.Location,
      type: models.sequelize.QueryTypes.SELECT,
      order: [['createdAt', 'DESC']],
    };
    return models.sequelize.query(query, options)
    .then((allLocations) => {
      return res.status(200).json({
        allLocations,
        message: 'All locations retrieved successfully',
      })
    })
    .catch(error => next(error))
  }
}

export const updateALocation = () => {
  return (req, res, next) => {
    const enums = ['name', 'maleResidents', 'femaleResidents'];
    const filteredEnums = Object.keys(req.body).filter(field => enums.includes(field));

    const { isValid, errors } = ValidatorClass.validateFieldsSync(filteredEnums, req.body);
    if(!isValid) return next(errors);

    return models.Location.findOne({
      where: {
        id: req.params.locationId
      },
    })
    .then((foundLocation) => {
      if (!foundLocation) throw errorFunction('location not found!', 404);

      return foundLocation.update({ ...req.body }, {
        fields: [...filteredEnums],
      })
    })
    .then(updatedFields => res.status(200).json({
      updatedFields,
      message: 'Location updated successfully'
    }))
    .catch(error => next(error));
  }
}

export const deleteAlocation = () => {
  return (req, res, next) => {
    return models.Location.findOne({
      where: {
        id: req.params.locationId
      }
    })
    .then((foundLocation) => {
      if (!foundLocation) throw errorFunction('location not found!', 404);

      return foundLocation.destroy();
    })
    .then(() => res.status(200).json({
      message: 'Location deleted successfully',
    }))
    .catch(error => next(error));
  }
}
