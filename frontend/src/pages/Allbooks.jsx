import React, { useEffect, useState } from 'react'
import axios from "axios";
import Loader from '../components/Loader/Loader'
import BookCard from '../components/BookCard/BookCard'

const Allbooks = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/user/books");
                console.log("API response:", response.data);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to fetch books. Please try again later.");
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center my-8'>
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='bg-zinc-900 h-auto px-12 py-8'>
            <h4 className='text-3xl text-yellow-100'>All Books</h4>
            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {data && data.map((book, i) => (
                    <BookCard key={book._id || i} data={book} />
                ))}
            </div>
        </div>
    )
}

export default Allbooks