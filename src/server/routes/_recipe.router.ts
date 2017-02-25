'use strict';

import * as express from 'express';
// Load `Router` model
import recipe = require('../models/recipe.model');
import Recipe = recipe.Recipe; // alias
import RecipeDocument = recipe.RecipeDocument; // alias
import Recipes = recipe.Recipes; // alias

import Router from './router';

const BASE_URI = '/recipe';

namespace Route {

  export class Routes extends Router {

    constructor(app: express.Application, router: express.Router) {
      super(app, router, Recipes);
      // Configure our router;
      this.config();
    }

    private config() {
      let router = super.getRouter();
      // Configure routes
      router.route(BASE_URI)
        .get((req, res, next) => {
          super.get(req, res, next);
        })
        .post((req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {
          let recipe = new Recipe({
            title : req.body.title,
            tags : req.body.tags,
            rating : req.body.rating,
            creator: req.body.creator,
            description : req.body.description,
            ingredients : req.body.ingredients,
            directions : req.body.directions,
          });
          super.create(req, res, next, recipe);
        });
      router.route(`${BASE_URI}/:recipe_id`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          let id = { _id: req.params.recipe_id };
          super.getOne(req, res, next, id);
        })
        .delete((req: express.Request,
                 res: express.Response,
                 next: express.NextFunction) => {
          let id = { _id: req.params.recipe_id };
          super.deleteOne(req, res, next, id);
        })
        .put((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          let id = { _id: req.params.recipe_id };
          let mod = (recipe) => {
            // Only update a field if a new value has been passed in
            if (req.body.title)
              recipe.title = req.body.title;
            if (req.body.tags)
              recipe.tags = req.body.tags;
            if (req.body.rating)
              recipe.rating = req.body.rating;
            if (req.body.creator)
              recipe.creator = req.body.creator;
            if (req.body.description)
              recipe.description = req.body.description;
            if (req.body.ingredients)
              recipe.ingredients = req.body.ingredients;
            if (req.body.directions)
              recipe.directions = req.body.directions;
          };
          super.updateOne(req, res, next, id, mod);
        });
    }
  }
}

export = Route;
