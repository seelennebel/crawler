# Links
Crawler Web Service: https://crawler-l0ib.onrender.com/   
Crawler Introduction on YouTube: https://youtu.be/CRDbHo0AAWc?si=W9oKhxELL6GY7KJQ

# Instructions to run the code on your local machine
```shell
git clone https://github.com/seelennebel/crawler.git
cd crawler
docker build . --tag crawler
docker run --rm --name app --env-file ./.env -p <loopback interface>:8080:8080 crawler
```
Loopback interface is usually 127.0.0.0 or 127.0.0.1
# .env file configuration
```shell
PORT=8080
API_KEY=<TeamUp API key>
CALENDAR_KEY=<calendar key>
SEPARATOR=,
APP_SERVER_URL=/
```
PORT - application port for the node js server  
API_KEY - teamup API key (receive here: https://teamup.com/api-keys/request)  
CALENDAR_KEY - a special string that represents a unique calendar ID inside teamup. An example of such string: https://teamup.com/hf0992dahdjdkn13od  
SEPARATOR - put here either a comma or a semi-colon CSV separator that you need specifically for your Excel configuration
APP_SERVER_URL - scheme, domain, top-level domain, and the port number of the backend server  
For example, if the backend server runs on localhost:8080: APP_SERVER_URL=http://localhost:8080

# Dependencies:
### Docker service installed on your local machine
