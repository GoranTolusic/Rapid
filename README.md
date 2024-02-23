RAPID Boilerplate (Requirements)

1. Make sure you have installed stable version of node (recommended is 16.14.0) on your OS

2. Make sure you have installed Postgre database on your OS or running Postgre on your docker container (sudo docker run --name postgreDb -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=1234 -v ~/postgres-data:/var/lib/postgresql/data -p 5432:5432 -d postgres).

3. Fill .env file with appropriate credentials for db connection and jwt configuration (look for .env.example file)



RUNNING APPLICATION

1. In root project run command "npm run InstallApp". This will:
    - Install all npm dependencies
    - Create appropriate database with name (configured in .env file) if not exists
    - Migrate tables which are not migrated yet

Or if you have docker running, you can just run "npm run dockerize" and this will build image, install application, and run server immediately in detached mode

2. in root project you can run command in terminal "npm run start" or start with watch mode "npm run dev"


TECHNOLOGY STACK:

1. Sunbird API is written on top of express.js framework

2. Sunbird API use typescript instead of plain javascript

3. Knex is used for migrations (https://knexjs.org/guide/migrations.html)

4. Typeorm is used as default orm library (https://typeorm.io/)



GENERAL OVERVIEW

1. "database" folder is located in root of project, and consists of two folders "migrations" and "seeds". Every change you need to make in database structure needs to be written in new file in migrations folder, and make sure that name of the file is alphabeticaly sorted "last" because migrations runs in alphabeticaly order

2. "start" folder is "container folder" for all registry and bootstraping application files. When you run server, application dynamicaly loads and register routes and middlewares in your code, and initializes connection to database and emqx services and load all entities for typeorm.

3. "types" folder holds files for registering types/interfaces/abstract classes which are needed accross your application

4. "src" folder is your main working folder.




"src" SRUCTURE

1. controllers - Main entry point of your requests. Whatever you return in controller, it's returned as response to client. Controller is supposed to be lean and not code heavy because their main purpose is to delegate logic to services.

2. services - Mainly for writing robust logic. Service classes are like method "containers" which works directly with orm repositories and other services needed for specific functionalities.

3. entity - folder with entity classes. Every entity should have Entity decorator with table name as parameter. Entity classes are main reason for working with typeorm.

4. helpers - place where you can store reusable code. Similar to services, but their mainly use is for quickly accessing reusable functionalities.

5. validationTypes - folder with validation classes. Mainly used to validate request inputs and params in middlewares, and modify/transform data for direct crud operations without need for furhter checkings. ValidationType classes share some common methods like "pickedProps" which are responsible for extracting only defined properties from request and proceeding those validated/transformed props as "_validated" object in your request body/params in your controller.

6. routes - standard for structuring your routes is simple - file name inside routes folder needs to be exact name as uri param after your basic url. For example: If you have "user.ts" file and defined routes in it, every route which points at "http://{baseUrl}/user/... will check routes in "user.ts" file. Check code for more examples

7. middlewares - standard for writing middlewares is exactly like routes. Check code for some examples and validations in middleware sections



TIPS & TRICKS

- Use "npm run format" to format your code and fix all errors before pushing your code to remote repository

- Wrap your middlewares and routes effectively with handlers (middlewareHandler when defining your middlewares and routeHandler when defining routes). Defining middlewares and routes without appropriate handlers can be risky because you open your application to potential error exceptions which can cause server crashes.

- Try to avoid seeder functions as much as you can to modify your data. Use migrations for scripts which needs to insert/modify your data. This ensures scripts will be executed only once. Seeder should be used in development environment for test/dummy data.

- Use "camelCase" format of column declaration for your database in migrations

- Decorate your validationType/controller/services classes with "@Service" decorator from "typedi" package. This will ensure that all classes are containerized with their dependencies and ready for use in your middlewares and routes. This way you can simply call your controller methods and pass them as second argument in your route definitions.

- Decorate your entity classes with "@Entity" decorator from "typeorm" package. This will ensure smoothly working and querying database with typeorm methods on your models.

- Make sure your validationType classes have pickedProps methods defined which return an array of defined params. Each param defined in pickedProps array is going to be extracted from input body/params and sent to furhter validation. This is due to security measures to prevent the entry of unwanted inputs and their entry into the database by working with crud operations. Also, maximize yor validations and middlewares as much as you can to transform and prepare your object for direct insert/update in your controller/services. This will cause less checking and "messy" code into your services. Once your requests pass validation with "validateDto" helper, you will have "_validated" object on your req.body or req.params with validated params from request. Make sure to use validateDto() in your middlewares before request reach controller.
