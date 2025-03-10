import {isValidObjectId} from 'mongoose';
import { Category, Restaurant } from '../models/index';
import { isValidLength } from '../utils/isValidLength';

const verifyMealWrapper = (isUpdate = false) => {
  return (req, res, next) => {
    try {
      const errors = {
        name: null,
        description: null,
        price: null,
        category: null,
        restaurant: null,
        vegan: null,
        celiac: null,
      };

      errors.name = isValidLength(req.body.name) ? null : 'Name must be between 4 and 20 characters';

      errors.description = isValidLength(req.body.description) ? null : 'Description must be between 4 and 20 characters';

      errors.price = typeof req.body.price === 'number' && req.body.price > 0 ? null : 'Price must be a number greater than 0';


      if (!isValidObjectId(req.body.category.toString())) {
        errors.category = "Not a valid Category";
      } else {
        const category = Category.findById(req.body.category);
        errors.category = category ? null : 'Category does not exist';
      };


      if (!isUpdate) {  /*SI ES UNA ACTUALIZACIÓN, NO ES NECESARIO VALIDAR EL RESTAURANT*/
        if (!isValidObjectId(req.body.restaurant.toString())) {
          errors.restaurant = "Not a valid Restaurant";
        } else {
          const restaurant = Restaurant.findById(req.body.restaurant);
          errors.restaurant = restaurant ? null : 'Restaurant does not exist';
        };
      } else {
        /*SIN EMBARGO HAY QUE VALIDAR QUE EL USUARIO ACTUAL SEA EL RESTAURANT DUEÑO DEL MEAL A MODIFICAR*/
      };


      if (!(typeof req.body.vegan === "boolean")) errors.vegan = "Vegan must be a boolean";

      if (!(typeof req.body.celiac === "boolean")) errors.celiac = "Celiac must be a boolean";

      if (Object.entries(errors).some((e) => e[1] != null)) {
        return res.status(400).send(errors);
      };

      return next();
    } catch (err) {
      return res.status(500).send({ message: 'Error creating Meal', });
    }
  };
};

export{verifyMealWrapper};
