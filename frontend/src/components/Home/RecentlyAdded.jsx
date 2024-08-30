import React, { useEffect, useState } from 'react'
import axios from "axios";
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecentlyAdded = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='mt-8 px-4'>
            <h4 className='text-3xl text-yellow-100'>Recently Added Books</h4>
            {!data && ( <div className='flex items-center justify-center my-8'>
                <Loader /> {" "}
                </div>
            )}
            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                
                {data && 
                    data.map((book, i) => (
                    <BookCard key={book._id || i} data={book} />
                ))}
            </div>
        </div>
    )
}

export default RecentlyAdded