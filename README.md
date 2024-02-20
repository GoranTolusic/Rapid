SUNBIRD APP (Requirements)

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