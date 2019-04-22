# PG-TEST-NODEJS

## Configuração inicial do projeto

- Rodar no MySql os seguintes comandos
  -     ```mysql
        CREATE DATABASE pg_test_nodejs;
        ```
  -     ```mysql
        CREATE USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY '1qaz2wsx3edc';
        ```
  -     ```mysql
        GRANT ALL PRIVILEGES ON *.* TO 'dev'@'localhost' WITH GRANT OPTION;
        ```
- Na pasta do projeto, rodar os seguintes comandos
    -   ```
        npm install
        ```
    -   ```
        node_modules/.bin/sequelize db:migrate
        ```

## Descrição do desenvolvimento do projeto
O projeto em si gira em torno de recebimento, em massa, de clientes via arquivo **.csv**, relacionados á um usuário, que pode escolher seu próprio identificador na base, desde que já não esteja sendo usado. Após o recebimento do nome, CEP e CPF de cada cliente, é feita uma requisição para a API ViaCEP para recuperação de dados de endereço. Em cima desses dados, temos atualização de clientes, remoção de usuários e clientes, mas também temos visualização de usuários, que traz também todos os dados dos seus clientes vinculados.
 
### Ferramentas utilizadas
 No processo de desenvolvimento, foi utilizado o sistema operacional **MacOS**, com **VSCode** para codificação, **Postman** para validação e testes das APIs e por último, **MySql** para armazenamento de dados.

### Bibliotecas utilizadas
 Para o desenvolvimento das APIs requisitadas pelo desafio, foi utilizado como pré-requisito o **Express**, para criação de APIs com o NodeJS, para logs da aplicação foi utilizada a biblioteca **Morgan**, para recebimento e armazenamento de arquivos, foi utilizado o **Multer**, que, com as configurações realizadas, facilita receber arquivos e valida-los. Na leitura dos arquivos foi utilizado um parser chamado **csv-parser**, para ajudar na leitura dos dados enviados. Como estava lidando com objetos, me senti na necessidade de usar uma biblioteca para facilitar esse processo, e que os processos de controle dos mesmos ficasse mais ágil e menos maçante, e , para isso, foi utilizada a biblioteca **Sequelize**, que faz com que esse processo fique muito mais simples, desde a conexão com o banco, até a realização de queries. Para auxiliar na conexão com o banco foi utilizada a biblioteca **mysql2**, e, por fim, para realizar as requisições de endereço pelo CEP, foi utilizado o **AXIOS**, que tem uma forma muito simples de lidar com requisições. Para desenvolvimento foi utilizado o **nodemon** para constante leitura das alterações, e, como dito anteriormente, o **Morgan ajudou na parte de logs das requisições**, com um breve resumo das mesmas.

### Documentação
 Como requisitado previamente, foi utilizado o swagger para a construção do documento das APIs. Confesso que nunca tinha utilizado antes, mas depois desse desafio, sei que não tem a menor possibilidade da criação de um projeto robusto sem uma documentação como essa, e, que apesar de ter ficado grande, é extremamente simples modulariza-la para facilitar o aumento da documentação.

- Url para verificação da documentação: **http://localhost:3000/api-docs/**

### Pontos finais
Sei que muito mais foi pedido, como testes unitários, docker e bibliotecas para logs mais robustas. Com certeza estudarei as tecnologias, mas infelizmente não consegui implementa-las no projeto. Agradeço a oportunidade, mesmo que não tenha correspondido 100% ao que foi pedido, aprendi muito, e com certeza seguirei estudando.