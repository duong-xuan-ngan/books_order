import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [customer, setCustomer] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchCustomerData();
    fetchBooks();
  }, []);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/user/order/checkout', {
        customerId: customer._id,
        books: books.map(book => ({ bookId: book._id, quantity: 1 })) // Adjust quantity as needed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Order placed:', response.data);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className='section-container'>
      <h2>CartPage</h2>
      {customer && (
        <div>
          <h3>Customer Information</h3>
          <p>Name: {customer.name}</p>
          <p>Phone Number: {customer.phoneNumber}</p>
          <p>Facebook Link: {customer.facebook_link}</p>
          <p>Dorm Color: {customer.dormColor}</p>
          <p>Room Number: {customer.roomNumber}</p>
        </div>
      )}
      <div>
        <h3>Books in Cart</h3>
        {books.map(book => (
          <div key={book._id}>
            <p>Title: {book.title}</p>
            <p>Price: {book.price}</p>
          </div>
        ))}
      </div>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage;