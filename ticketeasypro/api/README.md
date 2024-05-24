# Instruções para executar apenas o backend em desenvolvimento (API REST)

Com o terminal no diretório `IES301_2024/ticketeasypro`
 - Executar `docker compose up postgres` (linux)
 - Executar `docker-compose up postgres` (windows)

Em outro terminal, no diretório `IES301_2024/ticketeasypro/api`
 - Executar `npm i --save-exact` (instala as dependencias nas suas versões exatas)
 - Executar `npx prisma db push` (cria as tabelas no banco de dados)
 - Executar `npm run dev` 



O que deve acontecer ao se cancelar um evento?
 - nada, apenas mudar o status para cancelado
 - mudar o status dos tickets daquele para cancelado também
 - apagar OrderItems relacionados aos ticket mudar status da Ordem de Compra para Cancelado (todo até aqui)

O que deve acontecer quando o cliente cancela uma compra?
 - Se já tivermos enviado os tickets, devemos excluir os tickets e gerar outros tornando o QRCode em posse do cliente inválido.
 - 

Na busca por eventos:
 - Se não tiver parametro da data para a filtragem, usara a o dia atual a partit da zero hora até o ulitmo dia do mês seguinte.
 - Filtros Notavei: Filtragem por Status do Evento, Filtragem Categoria;
 - Todas as datas e horas devem ser passadas para a API em TIMESTAMP UTC (sem timezone) em milisegundos.
 - A ordenação sera por price, date e name

 
## Introdução
Bem-vindo à API do TicketEasyPro! Esta API permite a busca e gerenciamento de eventos. Siga as instruções abaixo para começar a utilizar.

## Endpoints
### PUT /events
Este endpoint permite atualizar campos específicos de um evento existente.

**Path Parameters:**

- `eventId` (integer, obrigatório): O ID do evento que deseja-se atualizar.

### Formato da Rota:

As rotas de atualização seguem o seguinte formato:

Por exemplo: `{{base_v1}}/events/eventId`

### Payload:

O payload deve ser enviado no corpo da requisição e deve conter os campos que deseja-se atualizar, seguindo o formato JSON. Os campos disponíveis para atualização são:
    
    
- `name` (string, opcional): O novo nome do evento.
- `description` (string, opcional): A nova descrição do evento.
- `location_id` (integer, opcional): O novo ID da localização do evento.
- `ts_final_date` (timestamp, opcional): A nova data e hora de término do evento, em formato de timestamp.
- `ts_initial_date` (timestamp, opcional): A nova data e hora de início do evento, em formato de timestamp.
- `status` (string, opcional): O novo status do evento Enum { "planned" | "in-progress" | "completed" | "cancelled" }. 
- `base_price` (integer, opcional): O novo preço base do evento em centavos.
- `capacity` (integer, opcional): A nova capacidade do evento.
- `img_banner` (string, opcional): A nova URL da imagem de banner do evento.
- `img_thumbnail` (string, opcional): A nova URL da imagem thumbnail do evento.
- `color` (string, opcional): A nova cor representativa do evento, um RGB.
- `category_id` (integer, opcional): O ID da nova categoria do evento.
- `manager_id` (string, opcional): O ID do novo gerente responsável pelo evento.

Exemplo de payload:

```json
{
  "name": "Corinthians x Santos",
  "description": "Jogo de volta.",
  "location_id": 1,
  "ts_final_date": 1716082602020,
  "ts_initial_date": 1716082442020
}


### GET /events
Retorna eventos filtrados e ordenados conforme os parâmetros fornecidos.

**Query Parameters**:
- `filter` (string, opcional): Busca por nome ou descrição do evento. Default: `null`.
- `status` (enum, opcional): Status do evento { "planned" | "in-progress" | "completed" | "cancelled" }. Default: `"planned"`.
- `category-id` (integer, obrigatório): ID da categoria do evento.
- `start-date` (integer, opcional): Timestamp UTC em milissegundos para filtrar eventos com início posterior ou igual à data/hora informada. Default: início do dia atual.
- `end-date` (integer, opcional): Timestamp UTC em milissegundos para filtrar eventos com inicio anterior ou igual à data/hora informada. Default: último dia do mês seguinte.
- `order-by` (string, opcional): Critérios de ordenação por [price(asc|desc), date:(asc|desc), name:(asc|desc)].

**Exemplo de Requisição**:
```http
GET: '{{base_v1}}/events?status=planned&category-id=4&filter=rock&order-by=price:asc,date:asc,name:desc'

exemplo de retorno:
{
    "data": [
        {
            "id": 3,
            "name": "Show do Supla",
            "description": "Show da Véio do Rock",
            "initial_date": "2024-05-21T03:33:47.000Z",
            "final_date": "2024-05-29T06:00:27.000Z",
            "status": "PLANNED",
            "base_price": 1450,
            "capacity": 125,
            "img_banner": "https://plus.unsplash.com/premium_photo-1682855222843-0cd0827ed6e3",
            "img_thumbnail": "https://plus.unsplash.com/premium_photo-1682855222930-210943bfdd6c",
            "color": "#FF5733",
            "category_id": 4,
            "manager_id": "5bc65cbc-8d2d-42c3-9f63-b98c929c2fa6",
            "location_id": 2
        }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 10
}



### GET /ticket-types
Retorna os tipos de tickets  filtrados e ordenados conforme os parâmetros fornecidos.

**Query Parameters**:
- `filter` (string, opcional): Busca por nome ou descrição do evento. Default: `null`.
- `status` (enum, opcional): Status do evento { "planned" | "in-progress" | "completed" | "cancelled" }. Default: `"planned"`.
- `category-id` (integer, obrigatório): ID da categoria do evento.
- `start-date` (integer, opcional): Timestamp UTC em milissegundos para filtrar eventos com início posterior ou igual à data/hora informada. Default: início do dia atual.
- `end-date` (integer, opcional): Timestamp UTC em milissegundos para filtrar eventos com inicio anterior ou igual à data/hora informada. Default: último dia do mês seguinte.
- `order-by` (string, opcional): Critérios de ordenação por [price(asc|desc), date:(asc|desc), name:(asc|desc)].

**Exemplo de Requisição**:
```http
GET: '{{base_v1}}/events?status=planned&category-id=4&filter=rock&order-by=price:asc,date:asc,name:desc'

exemplo de retorno:
{
    "data": [
        {
            "id": 3,
            "name": "Show do Supla",
            "description": "Show da Véio do Rock",
            "initial_date": "2024-05-21T03:33:47.000Z",
            "final_date": "2024-05-29T06:00:27.000Z",
            "status": "PLANNED",
            "base_price": 1450,
            "capacity": 125,
            "img_banner": "https://plus.unsplash.com/premium_photo-1682855222843-0cd0827ed6e3",
            "img_thumbnail": "https://plus.unsplash.com/premium_photo-1682855222930-210943bfdd6c",
            "color": "#FF5733",
            "category_id": 4,
            "manager_id": "5bc65cbc-8d2d-42c3-9f63-b98c929c2fa6",
            "location_id": 2
        }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 10
}





#TO-DO
 - Deve haver uma forma alternativa ao qrCode de validar ingresso usando apenas dados impressos no ticket (id da ordem de compra, id do cliente, id do ticket);

 - O ticket de entrada (ingresso) deve conter além dos ids acima, identificador do próprio ingresso e o tipo de ingresso;

 - validar se o qrcode do evento está sendo usado no local/evento correto (no jeito que está um ingresso comprado pra qualquer local/evento rodaria a catraca de qualquer outro local/evento );

 - no guichê só serão feitos pagamentos das ordens de compra feitas pelo cliente em seu perfil logado e re/impressões de tickets;



** REFERÊNCIAS

Envio de e-mail: https://medium.com/xp-inc/envio-de-e-mail-com-typescript-e-node-js-435eae69496a

Autenticação JWT: https://www.youtube.com/watch?v=pvrKHpXGO8E&ab_channel=Rocketseat

Email de Reset de Senha: https://www.youtube.com/watch?v=72JYhSoVYPc&ab_channel=MafiaCodes