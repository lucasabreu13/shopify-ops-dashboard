export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function calculateKpis(orders) {
  const paidOrders = orders.filter((order) => order.status === 'paid');
  const revenue = paidOrders.reduce((total, order) => total + order.total, 0);
  const averageTicket = paidOrders.length === 0 ? 0 : revenue / paidOrders.length;
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;

  return {
    revenue,
    averageTicket,
    paidOrders: paidOrders.length,
    pendingOrders
  };
}

export function topProducts(orders, limit = 4) {
  const byProduct = new Map();

  for (const order of orders) {
    if (order.status === 'refunded') {
      continue;
    }

    for (const item of order.items) {
      const current = byProduct.get(item.sku) ?? {
        sku: item.sku,
        name: item.name,
        quantity: 0,
        revenue: 0
      };

      current.quantity += item.quantity;
      current.revenue += item.quantity * item.unitPrice;
      byProduct.set(item.sku, current);
    }
  }

  return [...byProduct.values()]
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, limit);
}

export function inventoryAlerts(products, threshold = 5) {
  return products
    .filter((product) => product.stock <= threshold)
    .sort((left, right) => left.stock - right.stock);
}
