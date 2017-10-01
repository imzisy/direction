# API Solution

An API to calculate shortest driving path and estimated driving time to visit all specified locations, starting from the first in the list.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
docker and docker-compose
```

### Installing docker

[docker-mac](https://www.docker.com/docker-mac)

[docker-windows](https://www.docker.com/docker-windows)

[docker-ubuntu](https://www.docker.com/docker-ubuntu)


## Running the test

```
docker-compose up
```

If you visit [http://127.0.0.1:3000](http://127.0.0.1:3000) you should see "It is Working".



## Built With
* Express Nodejs
* Redis 

## API Documntation :

- [POST `/route`: Submit start point and drop-off locations](#submit-start-point-and-drop-off-locations)
- [GET `/route/<TOKEN>`: Get shortest driving route](#get-shortest-driving-route)

### Submit start point and drop-off locations

Method:  
 - `POST`

URL path:  
 - `/route`

Input body:  

```json
[
	["ROUTE_START_LATITUDE", "ROUTE_START_LONGITUDE"],
	["DROPOFF_LATITUDE_#1", "DROPOFF_LONGITUDE_#1"],
	...
]
```

Response body:  
 - `HTTP code 200`  

```json
{ "token": "TOKEN" }
```
---

Input body example:

```json
[
	["22.372081", "114.107877"],
	["22.284419", "114.159510"],
	["22.326442", "114.167811"]
]
```

Response example:

```json
{ "token": "r1YiiTpoW" }
```

### Get shortest driving route
Get shortest driving route for submitted locations (sequence of `[lat, lon]` values starting from start location resulting in shortest path)

Method:  
- `GET`

URL path:  
- `/route/<TOKEN>`

Response body:  
- HTTP 200  

```json
{
	"status": "success",
	"path": [
		["ROUTE_START_LATITUDE", "ROUTE_START_LONGITUDE"],
		["DROPOFF_LATITUDE_#1", "DROPOFF_LONGITUDE_#1"],
		...
	],
	"total_distance": DRIVING_DISTANCE_IN_METERS,
	"total_time": ESTIMATED_DRIVING_TIME_IN_SECONDS
}
```  
or  

```json
{
	"status": "in progress"
}
```  
or  

```json
{
	"status": "failure",
	"error": "ERROR_DESCRIPTION",
	"googleError": "ZERO_RESULTS"
}
```

---

URL example:  
 - `/route/r1YiiTpoW`

Response example:  
```json
{
	"status": "success",
	"path": [
		["22.372081", "114.107877"],
		["22.326442", "114.167811"],
		["22.284419", "114.159510"]
	],
	"total_distance": 18143,
	"total_time": 1778
}
```
