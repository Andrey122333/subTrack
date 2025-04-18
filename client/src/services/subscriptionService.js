// client/src/services/subscriptionService.js

const BASE_URL = window.location.href+'api/subscriptions' || 'http://localhost:4000/api/subscriptions';

/** Получить все подписки (READ) */
export async function getAllSubscriptions() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }
  return await response.json();
}

/** Создать новую подписку (CREATE) */
export async function createSubscription(subscriptionData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData),
  });
  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }
  return await response.json();
}

/** Обновить подписку (UPDATE) */
export async function updateSubscription(id, subscriptionData) {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData),
  });
  if (!response.ok) {
    throw new Error('Failed to update subscription');
  }
  return await response.json();
}

/** Удалить подписку (DELETE) */
export async function deleteSubscription(id) {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete subscription');
  }
  return await response.json();
}
