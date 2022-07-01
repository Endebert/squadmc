FROM node:16

# set working directory
WORKDIR /app

# copy local files into container
COPY . /app

# run yarn to install dependencies
RUN yarn

# run command to build production files
CMD ["yarn", "run", "build"]
