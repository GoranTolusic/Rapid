import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { registry } from './registry';
import { envValidation } from './envValidation';

//bootstrap the app
export const bootstrap = async () => {
    const app: Express = express();
    app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

    //Environment Validation
    const hasErrors = envValidation()
    if (hasErrors) throw new Error('Shutting down process...')

    //dynamicaly register and load middlewares and routes
    registry(app).then(expressApplication => {
        expressApplication.listen(process.env.PORT, () => {
            console.log("\x1b[32m", `We are live! Server is running at ${process.env.HOST}:${process.env.PORT}`, '\x1b[0m')
        })
    })
};



