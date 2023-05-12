#!/bin/bash

npm run http POST http://127.0.0.1:3001/api/command aggregateName:customer,  command:CREATE, 'payload:{name:"Pete", location:"London"},' aggregateId:customer-1

npm run http POST http://127.0.0.1:3001/api/command aggregateName:customer,  command:CREATE, 'payload:{name:"Anna", location:"Rome"},' aggregateId:customer-2

npm run http POST http://127.0.0.1:3001/api/command aggregateName:order,  command:CREATE, 'payload:{customerId:customer-1, text:"Rubber Chicken", value:13.99},' aggregateId:order-1
