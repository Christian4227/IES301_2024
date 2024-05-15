# Instruções para executar apenas o backend em desenvolvimento (API REST)

Com o terminal no diretório `IES301_2024/ticketeasypro`
 - Executar `docker compose up postgres` (linux)
 - Executar `docker-compose up postgres` (windows)

Em outro terminal, no diretório `IES301_2024/ticketeasypro/api`
 - Executar `npm i --save-exact` (instala as dependencias nas suas versões exatas)
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


##GERAL
 - As rotas de update de atributos terão o seguinte formato 
    `url_base_v1/entidade/id_da_entidade/nome_do_atributo`
    ex. "{{base_v1}}/events/870f7d1f-0e26-4002-8521-2a7c00d749bf/status"








** REFERÊNCIAS

Envio de e-mail: https://medium.com/xp-inc/envio-de-e-mail-com-typescript-e-node-js-435eae69496a