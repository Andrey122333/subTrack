// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from './services/subscriptionService';
import './App.css';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);

  // Поля формы
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Если editId != null, значит мы в режиме "Редактировать"
  const [editId, setEditId] = useState(null);

  // Состояние ошибок
  const [errors, setErrors] = useState({});

  // При первом рендере подгружаем список подписок (READ)
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  /** Получить список подписок с бэкенда */
  async function fetchSubscriptions() {
    try {
      const data = await getAllSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  }

  /** Проверка данных перед отправкой */
  function validateForm() {
    let newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!cost.trim()) newErrors.cost = 'Cost is required';
    if (!startDate.trim()) newErrors.startDate = 'Start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true, если ошибок нет
  }

  /** Обработчик ввода данных — обновляет state и убирает ошибку */
  function handleInputChange(field, value) {
    // Обновляем состояние
    if (field === 'name') setName(value);
    if (field === 'cost') setCost(value);
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);

    // Если поле заполнилось, убираем ошибку
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim() ? undefined : prevErrors[field], // Если поле пустое, оставляем ошибку
    }));
  }

  /** Создать новую подписку или обновить существующую */
  async function handleCreateOrUpdate(e) {
    e.preventDefault();

    if (!validateForm()) return; // Если валидация не пройдена — не отправляем запрос

    try {
      if (editId) {
        const updated = await updateSubscription(editId, {
          name,
          cost,
          startDate,
          endDate,
        });

        setSubscriptions(
          subscriptions.map((sub) => (sub._id === editId ? updated : sub))
        );

        setEditId(null);
      } else {
        const newSub = await createSubscription({
          name,
          cost,
          startDate,
          endDate,
        });

        setSubscriptions([...subscriptions, newSub]);
      }

      // Очищаем поля и ошибки
      setName('');
      setCost('');
      setStartDate('');
      setEndDate('');
      setErrors({});
    } catch (error) {
      console.error('Error creating/updating subscription:', error);
    }
  }

  /** Начать редактирование конкретной подписки */
  function handleEditClick(subscription) {
    setEditId(subscription._id);
    setName(subscription.name || '');
    setCost(subscription.cost || '');
    setStartDate(subscription.startDate ? subscription.startDate.slice(0, 10) : '');
    setEndDate(subscription.endDate ? subscription.endDate.slice(0, 10) : '');
    setErrors({}); // Очищаем ошибки при редактировании
  }

  /** Удалить подписку */
  async function handleDeleteClick(id) {
    try {
      await deleteSubscription(id);
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  }

  return (
    <div className="page-container">
      <h1>Subscriptions 9</h1>

      <h2>Add subscription</h2>

      {/* Форма создания/редактирования подписки */}
      <form onSubmit={handleCreateOrUpdate} className="form-container">
        <div className="form-container-item">
          <label htmlFor="name">Name:*</label>
          <input
            id="name"
            type="text"
            placeholder="Netflix"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-container-item">
          <label htmlFor="cost">Cost:*</label>
          <input
            id="cost"
            type="number"
            min="0"
            placeholder="10"
            value={cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
            className={errors.cost ? 'error' : ''}
          />
          {errors.cost && <p className="error-text">{errors.cost}</p>}
        </div>

        <div className="form-container-item">
          <label htmlFor="startDate">Start Date:*</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <p className="error-text">{errors.startDate}</p>}
        </div>

        <div className="form-container-item">
          <label htmlFor='endDate'>End Date (optional): </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </div>

        <button type="submit">
          {editId ? 'Update Subscription' : 'Add Subscription'}
        </button>
      </form>

      {/* Список подписок */}
      <h2>Subscription list</h2>

      <div className='subscription-list'>
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <div key={sub._id} className="subscription-item">
              <div>
                <b>{sub.name}</b> | {sub.cost}$ |{' '}
                {new Date(sub.startDate).toLocaleDateString()}
                {sub.endDate ? ' - ' + new Date(sub.endDate).toLocaleDateString() : ''}
              </div>
              <div className='subscription-item_buttons'>
                <button onClick={() => handleEditClick(sub)}>Edit</button>
                <button onClick={() => handleDeleteClick(sub._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-subscriptions">
            You have no subscriptions yet. Add a new one!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
