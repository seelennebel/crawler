# Configuration
.env format
```shell
ENV_VARIABLE=VALUE
```
./server/.env
```shell
PORT
API_KEY
CALENDAR_KEY
SEPARATOR
```
PORT - application port for the node js server  
API_KEY - teamup API key (receive here: https://teamup.com/api-keys/request)  
CALENDAR_KEY - a special string that represents a unique calendar ID inside teamup. An example of such string: https://teamup.com/hf0992dahdjdkn13od  
SEPARATOR - put here either a comma or a semi-colon CSV separator that you need specifically for your Excel configuration

./frontend/.env
```shell
APP_SERVER_URL
```
APP_SERVER_URL - scheme, domain, top-level domain, and the port number of the backend server  
For example, if the backend server runs on localhost:8080: APP_SERVER_URL=http://localhost:8080
