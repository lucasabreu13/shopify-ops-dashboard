import { calculateKpis, formatCurrency, inventoryAlerts, topProducts } from './metrics.js';

const state = {
  orders: [],
  products: [],
  selectedStatus: 'all'
};

const statusLabels = {
  paid: ['Pago', 'success'],
  pending: ['Pendente', 'warning'],
  refunded: ['Estornado', 'secondary']
};

async function loadData() {
  const [ordersResponse, productsResponse] = await Promise.all([
    fetch('./data/orders.json'),
    fetch('./data/products.json')
  ]);

  state.orders = await ordersResponse.json();
  state.products = await productsResponse.json();
  render();
}

function render() {
  renderKpis();
  renderOrders();
  renderInventoryAlerts();
  renderTopProducts();
}

function renderKpis() {
  const kpis = calculateKpis(state.orders);
  const cards = [
    ['Receita paga', formatCurrency(kpis.revenue), 'bi-cash-stack'],
    ['Ticket medio', formatCurrency(kpis.averageTicket), 'bi-graph-up-arrow'],
    ['Pedidos pagos', kpis.paidOrders, 'bi-check2-circle'],
    ['Pendentes', kpis.pendingOrders, 'bi-hourglass-split']
  ];

  document.querySelector('#kpiGrid').innerHTML = cards.map(([label, value, icon]) => `
    <div class="col-6 col-xl-3">
      <article class="metric">
        <div class="metric-icon"><i class="bi ${icon}"></i></div>
        <span>${label}</span>
        <strong>${value}</strong>
      </article>
    </div>
  `).join('');
}

function renderOrders() {
  const filtered = state.selectedStatus === 'all'
    ? state.orders
    : state.orders.filter((order) => order.status === state.selectedStatus);

  document.querySelector('#ordersTable').innerHTML = filtered.map((order) => {
    const [label, color] = statusLabels[order.status];

    return `
      <tr>
        <td class="fw-semibold">${order.name}</td>
        <td>${order.customer}</td>
        <td><span class="badge text-bg-${color}">${label}</span></td>
        <td>${order.channel}</td>
        <td class="text-end fw-semibold">${formatCurrency(order.total)}</td>
      </tr>
    `;
  }).join('');
}

function renderInventoryAlerts() {
  const alerts = inventoryAlerts(state.products);
  document.querySelector('#inventoryAlerts').innerHTML = alerts.map((product) => `
    <article class="list-item">
      <div>
        <strong>${product.name}</strong>
        <span>${product.sku}</span>
      </div>
      <strong class="stock-count">${product.stock}</strong>
    </article>
  `).join('');
}

function renderTopProducts() {
  const products = topProducts(state.orders);
  const maxRevenue = Math.max(...products.map((product) => product.revenue));

  document.querySelector('#topProducts').innerHTML = products.map((product) => `
    <article class="product-row">
      <div class="d-flex justify-content-between mb-2">
        <strong>${product.name}</strong>
        <span>${formatCurrency(product.revenue)}</span>
      </div>
      <div class="progress" role="progressbar" aria-label="${product.name}">
        <div class="progress-bar" style="width: ${(product.revenue / maxRevenue) * 100}%"></div>
      </div>
    </article>
  `).join('');
}

document.querySelector('#statusFilter').addEventListener('change', (event) => {
  state.selectedStatus = event.target.value;
  renderOrders();
});

document.querySelector('#refreshButton').addEventListener('click', loadData);

loadData();
