
## Desafio Dev.Academy

  

Desenvolva uma API REST para 2 entidades: produtos e clientes. Toda a arquitetura deve ser serverless utlizando API Gateway, Lambda e DynamoDB.

Cada entidade deve ter uma lambda e uma tabela cada, garantindo a escalabilidade separadas dos componentes do sistema. A API deve permitir operações CRUD básicas de coleção e recursos, atráves dos verbos comuns: GET, POST, PUT, DELETE.

Nas rotas de consulta da coleção, permita que o client envie um parâmetro `filter` pela URL para filtragem de nomes que contenham o valor do parâmetro, por exemplo:

  

```curl

GET /produtos?filter=xpto

```

  

Deverá trazer os produtos que contenha a string xpto no nome.

  

## Resultado

  

A entrega do seu código deve ser realizada via Pull Request (PR) para este repositório e deve conter:

  

- Template do CloudFormation mapeado todos os recursos necessários

- Código da API escrito em Node.js

  

## Rotas esperadas

  

### Produtos

  

- GET /produtos

- GET /produtos?filter=NOME

- GET /produtos/:id

- POST /produtos

- PUT /produtos/:id

- DELETE /produtos/:id

  

### Clientes

  

- GET /clientes

- GET /clientes?filter=NOME

- GET /clientes/:id

- POST /clientes

- PUT /clientes/:id

- DELETE /clientes/:id

## Implementação
- Todas as rotas foram implementadas, e posteriormente testadas com insomnia. 
- Para testar as requisições foi utilizado o **Docker** e o **dynamodb-admin** para simular um banco de dados local do DynamoDB.
- Cloud Formation Template : 
 ![enter image description here](https://i.ibb.co/xfF5hTq/cf-template.png)