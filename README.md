# fcp-sfd-accelerator

The accelerator repository is designed to streamline the setup of GitHub repositories for the Single Front Door (SFD) team.

## Initial setup

This repo comes with a `rename` script that will update the project name, package description, port for local development.

To intiate the script, the command must be executed as shown in the example below:
```
./rename.js fcp-sfd-example 'this is an example repo' 3002
```
Note the project description must be wrapped in quotes.

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v11`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd fcp-sfd-accelerator
nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
npm install
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

### Testing

To test the application run:

```bash
npm run test
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json).
To view them in your command line run:

```bash
npm run
```

### Update dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag fcp-sfd-accelerator:development .
```

Run:

```bash
docker run -e PORT=3000 -p 3000:3000 fcp-sfd-accelerator:development
```

### Production image

Build:

```bash
docker build --no-cache --tag fcp-sfd-accelerator .
```

Run:

```bash
docker run -e PORT=3000 -p 3000:3000 fcp-sfd-accelerator
```

### Docker Compose

A local environment with:

- Localstack for AWS services (S3, SQS)
- Redis
- MongoDB
- This service.
- A commented out frontend example.

```bash
docker compose up --build -d
```

### SonarCloud

Instructions for setting up SonarCloud can be found in [sonar-project.properties](./sonar-project.properties)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of His Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
