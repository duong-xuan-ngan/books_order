import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/books/find/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className='px-12 py-8 flex'>
      <div className='bg-zinc-800 rounded p-4'>
        <img src={book.image} alt={book.title} className='h-[40vh] w-full object-cover'/>
      </div>
      <div className='p-4'>
        <h2 className='text-3xl text-red'>{book.title}</h2>
        <p className='text-gray-400'>Tác giả: {book.author}</p>
        <p className='text-gray-400'>Tên Nhà Cung Cấp: {book.publisher}</p>
        <p className='text-gray-400'>Số trang: {book.pages}</p>
        <p className='text-yellow-500'>Giá: {book.price} đ</p>
        <p className='text-blue'>Mô tả {book.description}</p>
      </div>
    </div>
  );
};

export default ViewBookDetails;