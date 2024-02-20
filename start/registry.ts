import { Express, Request, Response } from 'express'
import { routeRegistry } from '../src/routes/routeRegistry';
import { middlewareRegistry } from '../src/middlewares/middlewareRegistry';
import { globalMiddlewares } from '../src/helpers/globalMiddlewares';

export const registry = async (app: Express) => {

    //Global middlewares
    console.log("\x1b[36m", 'Registering and assigning global middlewares. Please wait ...', '\x1b[0m')
    globalMiddlewares(app)
   
    //Middleware registry
    console.log("\x1b[36m", 'Registering middlewares. Please wait ...', '\x1b[0m')
    middlewareRegistry(app)

    //Route registry
    console.log("\x1b[36m", 'Registering routes. Please wait ...', '\x1b[0m')
    routeRegistry(app)

    app.all('*', function (req: Request, res: Response) {
        res.status(404).send({
            message: 'Unknown route'
        });
    })

    return app
};