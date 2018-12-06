FROM golang:latest as build

WORKDIR /backend
ADD . .

# NOTE: the first command might not be neccessary, if the build command fetches based on imports in file
# RUN go mod vendor && go mod download
RUN go build

ENV PORT=8080
EXPOSE 8080
CMD ["./backend"]