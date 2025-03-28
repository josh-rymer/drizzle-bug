```
yarn install
yarn docker:up
yarn db:migrate
yarn db:seed
yarn dev

POST http://localhost:3000 body: {"codeValue": "code value"}

curl -X POST http://localhost:3000 \
     -H "Content-Type: application/json" \
     -d '{"codeValue": "code value"}'
```
