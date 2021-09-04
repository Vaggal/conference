# conference

An HTTP and Socket.io server for a multi-user video and chat system.

## Running the project locally

You should have node 15+ installed locally.

Running `npm start` will start the http and socket.io servers.

## Deploying the project

The project is deployed in Heroku which will run it automatically as soon as a new version is deployed.

We need to have the Heroku CLI installed.
Install it by running:

```bash
npm install -g heroku
```

Before running any Heroku CLI command login to Heroku:

```bash
heroku login
```

In order to deploy a new version we push the `main` branch to the Heroku remote. In this branch we also commit the conference-vue distribution files.

To push a new version of the project run:

```bash
git push heroku main
```

### Provided commands

There are several scripts that provide an easier way to execute some tasks in the project.

#### Install the packages

```bash
npm install
```

#### Run the servers

```bash
npm start
```

#### Format all the files

```bash
npm run prettier
```
