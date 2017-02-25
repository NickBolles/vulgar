import * as express from 'express';

export default class Router {

  app: express.Application;
  router: express.Router;
  model: any;

  constructor(app: express.Application,
              router: express.Router,
              model: any) {
    this.app = app;
    this.router = router;
    this.model = model;
  }

  public getRouter() { return this.router; }

  protected get(req: express.Request,
                res: express.Response,
                next: express.NextFunction) {
    // Use mongoose to get all requested items in the database
    this.model.find((err, item) => {
      if (err) {
        res.send(err);
      } else {
        res.json(item);
      }
    });
  }

  protected getOne(req: express.Request,
                   res: express.Response,
                   next: express.NextFunction,
                   id: any) {

    this.model.findOne(id, (err, item) => {

      if (err) {
        res.send(err);
      } else {
        res.json(item);
      }
    });
  };

  protected create(req: express.Request,
                   res: express.Response,
                   next: express.NextFunction,
                   dataModel: any) {
    this.model.create(dataModel, (err, item) => {
      if (err)
        res.send(err);
      else {
        res.json(item);
        // DEBUG
        console.log(`Item created: ${item}`);
      }
    });
  }

  protected deleteOne(req: express.Request,
                      res: express.Response,
                      next: express.NextFunction,
                      id: any) {

    this.model.remove(id, (err) => {

      if (err) {
        res.send(err);
      } else {
        // HTTP `204` - `No Content`
        res.sendStatus(204);
      }
    });
  };

  protected updateOne(req: express.Request,
                      res: express.Response,
                      next: express.NextFunction,
                      id: any,
                      mod: any) {

    // use our model to find the item we want
    this.model.findOne(id, (err, item) => {
      if (err) {
        res.send(err);
      }
      // Apply passed in data modifications
      mod(item);
      // save the todo item
      return item.save((err2) => {
        if (err2) {
          res.send(err2);
        }
        return res.send(item);
      });
    });
  };
}
