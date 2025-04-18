// subscriptionService.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../src/services/subscriptionService';

describe('subscriptionService', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Подменяем глобальный fetch на mock
    globalThis.fetch = mockFetch;
  });

  afterEach(() => {
    vi.resetAllMocks(); // сбрасываем вызовы mock'ов
  });

  describe('getAllSubscriptions', () => {
    it('должен вернуть массив подписок при успешном запросе', async () => {
      const mockData = [
        { _id: '1', name: 'Netflix', cost: 10 },
        { _id: '2', name: 'Spotify', cost: 5 },
      ];

      // Настраиваем "ответ" fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getAllSubscriptions();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/subscriptions');
    });

    it('должен выкидывать ошибку, если ответ не ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(getAllSubscriptions()).rejects.toThrow('Failed to fetch subscriptions');
    });
  });

  describe('createSubscription', () => {
    it('должен вернуть созданную подписку при успешном POST-запросе', async () => {
      const subscriptionData = { name: 'New Sub', cost: 15 };
      const mockCreated = { _id: '123', ...subscriptionData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreated,
      });

      const result = await createSubscription(subscriptionData);
      expect(result).toEqual(mockCreated);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/subscriptions', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      }));
    });

    it('должен выкидывать ошибку, если ответ не ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(createSubscription({})).rejects.toThrow('Failed to create subscription');
    });
  });

  describe('updateSubscription', () => {
    it('должен вернуть обновлённую подписку при успешном PUT-запросе', async () => {
      const subscriptionData = { name: 'Updated Sub', cost: 20 };
      const id = '999';
      const mockUpdated = { _id: id, ...subscriptionData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdated,
      });

      const result = await updateSubscription(id, subscriptionData);
      expect(result).toEqual(mockUpdated);
      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/subscriptions/${id}`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscriptionData),
        })
      );
    });

    it('должен выкидывать ошибку, если ответ не ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(updateSubscription('999', {})).rejects.toThrow('Failed to update subscription');
    });
  });

  describe('deleteSubscription', () => {
    it('должен вернуть результат при успешном DELETE-запросе', async () => {
      const id = '123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await deleteSubscription(id);
      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/subscriptions/${id}`, expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('должен выкидывать ошибку, если ответ не ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(deleteSubscription('123')).rejects.toThrow('Failed to delete subscription');
    });
  });
});
