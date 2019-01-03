
############################################################
# Dockerfile to run cricd-read-api
############################################################

FROM node:alpine
MAINTAINER Bradley Scott

# Copy code to container
RUN mkdir cricd-read-api
COPY . /cricd-read-api

# Get dependencies
RUN cd cricd-read-api \
	&& npm install

# Define working directory.
WORKDIR /cricd-read-api

# Start the service
CMD npm start

# Expose ports.
EXPOSE 3000
