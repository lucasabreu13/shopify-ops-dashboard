# Shopify Ops Dashboard

Painel operacional para acompanhar pedidos, estoque e indicadores de uma loja em Shopify ou e-commerce parecido. O foco aqui e transformar JSON de pedidos/produtos em uma tela simples para tomada de decisao.

## Stack

- HTML, CSS e JavaScript
- Bootstrap 5
- Bootstrap Icons
- Node.js para servidor local e testes

## O que o painel mostra

- Receita paga
- Ticket medio
- Pedidos pendentes
- Produtos com estoque baixo
- Produtos com maior receita
- Filtro por status do pedido

## Como rodar

```bash
npm install
npm start
```

Acesse:

```text
http://localhost:4173
```

## Testes

```bash
npm test
```

Os testes cobrem as funcoes de calculo de KPI, ranking de produtos e alerta de estoque.

## Estrutura

```text
data/          dados simulados de pedidos e produtos
src/app.js     renderizacao da tela
src/metrics.js regras de calculo testaveis
src/styles.css estilos do dashboard
```
