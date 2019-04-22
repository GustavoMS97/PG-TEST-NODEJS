module.exports = {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Projeto controle de usuários, arquivos e clientes.',
    description:
      'Esse projeto foi desenvolvido para o desafio da pgmais, com o intuito de demonstração de habilidades de desenvolvimento e boas práticas.',
  },
  schemes: ['http'],
  host: 'localhost:3000',
  basePath: '/api/v.01',
  paths: {
    '/files': {
      post: {
        summary:
          'Api para postar um arquivo no seguinte formato nome_id.csv, contendo dados de clientes(Nome, CEP e CPF).',
        description:
          'Processo assíncrono, que ao salvar os dados do cliente, já retorna uma resposta para o usuário, mas em background, ainda realiza a persistencia dos clientes e seus endereços.',
        parameters: [
          {
            name: 'file',
            in: 'form-data',
            description:
              'Arquivo CSV contendo os dados dos clientes no formato nome;cep;cpf',
            schema: {
              type: 'file',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Objeto com os dados do usuário que será criado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                    },
                    name: {
                      type: 'string',
                    },
                    file_name: {
                      type: 'string',
                    },
                    date_sent: {
                      type: 'string',
                      format: 'date-time',
                    },
                    status: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: `É retornado esse erro quando:\n
              - Não for enviado o arquivo.\n
              - Tipo de arquivo não é CSV.\n
              - Nome do arquivo não está no formato nome_id.csv\n
              - Má formatação do arquivo, que deve seguir os seguintes cabeçalhos: Nome, CEP e CPF.`,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description:
              'Retorna erro quando houver algum no processo de leitura/inserção dos dados do usuário.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary:
          'Api para visualização dos dados do usuário, assim como seus clientes e, cada um com seu endereço.',
        description: `Essa request realiza a busca dos dados do usuário no banco, 
        assim como os seus clientes vinculados pelo arquivo, 
        e o endereço de cada um, que foi gerado a partir de seu CEP enviado no arquivo.`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Id do usuário que deseja visualizar os dados.',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description:
              'Retorna um objeto contendo as informações do usuário, assim como seus clientes vinculados, e cada um com seu endereço vinculado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                    },
                    name: { type: 'string' },
                    file_name: { type: 'string' },
                    date_sent: { type: 'string', format: 'date-time' },
                    clients: {
                      type: 'array',
                      items: {
                        teste: 'object',
                        properties: {
                          _id: { type: 'integer' },
                          name: { type: 'string' },
                          CEP: { type: 'string' },
                          CPF: { type: 'string' },
                          date_sent: { type: 'string', format: 'date-time' },
                          address: {
                            type: 'object',
                            properties: {
                              district: { type: 'string' },
                              street: { type: 'string' },
                              state: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: `É retornado esse erro quando:\n
              - Não for enviado o id do usuário na request.\n`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
          '500': {
            description:
              'Retorna erro quando houver algum no processo de buscar os dados do usuário e seus clientes.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
        },
      },
      delete: {
        summary:
          'Api para deletar dados do usuário e todos os seus clientes, cada um com seu endereço.',
        description: `Essa request realiza uma remoção dos dados do usuario na base, 
        deletando juntamente, seus clientes vinculados pelo arquivo, 
        e os endereços de cada cliente, gerado pelo seu CEP.`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Id do usuário que deseja remover os dados.',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: `É retornado esse código de sucesso quando:\n
            - Usuário for deletado com sucesso.
            - Não for encontrado usuário com código fornecido.`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/simpleUserSchema',
                },
              },
            },
          },
          '400': {
            description: `É retornado esse erro quando:\n
              - Não for enviado o id do usuário na request.\n`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
          '500': {
            description:
              'Retorna erro quando houver algum problema no processo de deletar os dados do usuário e seus clientes.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
        },
      },
    },
    '/client/{id}': {
      put: {
        summary: 'Api para atualização dos dados do cliente.',
        description: `Esta requisição serve para que seja possivel atualizar dados do cliente,
           como nome, cep e cpf, atualizando os dados do mesmo sempre que necessário.`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Id do cliente que deseja atualizar os dados.',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        requestBody: {
          description: `O objeto representado abaixo contém os dados que podem ser enviados para a API. 
            Nenhum dos campos é obrigatório, no entando, se for enviado, será validado o tipo e o conteúdo.`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  cep: { type: 'string' },
                  cpf: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: `Quando a requisição for realizada com sucesso, será retornado este código, 
            com o objeto do cliente e suas atualizações`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/simpleClientSchema',
                },
              },
            },
          },
          '400': {
            description: `Retorna este erro quando houver algum problema com os dados enviados na requisição, 
              como falta de id, ou má formatação dos campos no corpo da requisição.`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
          '500': {
            description:
              'Retorna erro quando houver algum problema no processo de atualizar os dados do cliente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
        },
      },
      delete: {
        summary:
          'Api para deletar dados do cliente e seu dado vinculado, que seria o endereço apenas.',
        description: `Essa requisição realiza uma remoção dos dados do cliente na base,
           deletando juntamente seu endereço vinculado, para que nao haja dados sem vínculos na base.`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Id do cliente que deseja remover os dados.',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: `Quando a requisição for realizada com sucesso, e os dados do cliente forem deletados com sucesso, assim como seus dados vinculados, a mesma retornará este código HTTP.`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/simpleClientSchema',
                },
              },
            },
          },
          '400': {
            description: `Retorna este erro quando houver algum problema com os dados enviados na requisição, 
              como falta de id`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
          '500': {
            description:
              'Retorna erro quando houver algum problema no processo de deletar os dados do cliente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/error',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      error: { properties: { message: { type: 'string' } } },
      simpleUserSchema: {
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          file_name: { type: 'string' },
          date_sent: { type: 'string', format: 'date-time' },
          status: { type: 'string' },
        },
      },
      simpleClientSchema: {
        properties: {
          _id: { type: 'integer' },
          name: { type: 'string' },
          date_sent: { type: 'string', format: 'date-time' },
          status: { type: 'string' },
        },
      },
    },
  },
};
