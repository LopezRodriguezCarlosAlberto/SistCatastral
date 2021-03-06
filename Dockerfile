FROM node:12.2.0

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
# COPY package.json /app/package.json
# COPY package.json /app/package.json

# set working directory
WORKDIR /app

# RUN npm install
RUN npm install -g @angular/cli

# add app
# COPY . /app
COPY node_modules .
COPY css/ e2e/ src/ vendor/ angular.json browserslist karma.conf.js package-lock.json package.json tsconfig.app.json tsconfig.json tsconfig.spec.json tslint.json ./

# start app
CMD ng serve --host 0.0.0.0