import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateKpis, inventoryAlerts, topProducts } from '../src/metrics.js';

test('calculateKpis considers only paid orders for revenue', () => {
  const result = calculateKpis([
    { status: 'paid', total: 100 },
    { status: 'pending', total: 70 },
    { status: 'paid', total: 50 }
  ]);

  assert.equal(result.revenue, 150);
  assert.equal(result.averageTicket, 75);
  assert.equal(result.pendingOrders, 1);
});

test('inventoryAlerts returns products under threshold first', () => {
  const result = inventoryAlerts([
    { sku: 'A', stock: 8 },
    { sku: 'B', stock: 1 },
    { sku: 'C', stock: 4 }
  ], 5);

  assert.deepEqual(result.map((product) => product.sku), ['B', 'C']);
});

test('topProducts ignores refunded orders', () => {
  const result = topProducts([
    {
      status: 'paid',
      items: [{ sku: 'A', name: 'Produto A', quantity: 2, unitPrice: 10 }]
    },
    {
      status: 'refunded',
      items: [{ sku: 'B', name: 'Produto B', quantity: 10, unitPrice: 10 }]
    }
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].sku, 'A');
  assert.equal(result[0].revenue, 20);
});
