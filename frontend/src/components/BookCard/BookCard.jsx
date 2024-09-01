import React from 'react'
import { Link } from 'react-router-dom';
import './BookCard.css'; // Add this line to import the new CSS file

const BookCard = ({ data }) => {
    return (
    <>
        <Link to={`/details/${data._id}`} className="book-card-link">
            <div className='book-card'>
                <div className='book-image-container'>
                    <img src={data.image} alt={data.title} className='book-image'/>
                </div>
                <div className='book-info'>
                    <h3 className='book-title'>{data.title}</h3>
                    <p className='book-author'>{data.author}</p>
                    <p className='book-price'>${data.price}</p>
                </div>
            </div>
        </Link>
    </>
    );
};

export default BookCard