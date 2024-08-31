import React, { useEffect, useState } from 'react';
import axios from "axios";
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import { Link } from 'react-router-dom';
import '/style.css';
import '/global.css';

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
        <div className="shop">
            <div className="div">
                <div className="overlap">
                    <div className="header"></div>
                    <div className="group">
                        <div className="overlap-group">
                            <div className="div-wrapper">
                                <div className="text-wrapper">Bookstore</div>
                            </div>
                        </div>
                    </div>
                    <div className="frame-wrapper">
                        <div className="frame">
                            <Link to="/">
                                <img className="bookclub-logo" src="/img/bookclub-logo-2-1.png" alt="Bookclub Logo" />
                            </Link>
                            <Link to="/" className="text-wrapper-2">Main page</Link>
                            <Link to="/agenda" className="text-wrapper-2">Agenda</Link>
                            <Link to="/all-book" className="text-wrapper-2">Book store</Link>
                            <Link to="/profile">
                                <img className="icon" src="/img/icon.svg" alt="Profile" />
                            </Link>
                            <img className="akar-icons-search" src="/img/akar-icons-search-1.svg" alt="Search" />
                            <Link to="/cart">
                                <img className="vector" src="/img/vector.svg" alt="Cart" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="group-2">
                    <div className="group-3">
                        <div className="text-wrapper-3">Filter</div>
                        <img className="system-uicons" src="/img/system-uicons-filtering.svg" alt="Filter" />
                    </div>
                    <div className="group-4">
                        <div className="text-wrapper-4">Sort by</div>
                        <div className="overlap-group-wrapper">
                            <div className="overlap-group-2">
                                <div className="text-wrapper-5">Default</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group-wrapper">
                    <div class="overlap-wrapper">
                        <div id="book-list" className="overlap-2">
                            <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                                {data && data.map((book, i) => (
                                    <BookCard key={book._id || i} data={book} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overlap-7">
                    <footer className="footer">
                        <div className="overlap-8">
                            <div className="group-7">
                                <div className="group-8">
                                    <div className="group-9">
                                        <div className="group-10">
                                            <div className="group-11">
                                                <div className="group-12">
                                                    <div className="text-wrapper-12">Landing Page</div>
                                                    <div className="text-wrapper-13">Agenda</div>
                                                    <div className="about">Bookstore</div>
                                                    <div className="text-wrapper-14">Contact</div>
                                                </div>
                                                <div className="text-wrapper-15">Links</div>
                                            </div>
                                            <div className="group-13">
                                                <div className="text-wrapper-15">Help</div>
                                                <div className="group-14">
                                                    <div className="text-wrapper-12">Payment Options</div>
                                                    <div className="text-wrapper-13">Returns</div>
                                                    <div className="text-wrapper-16">Privacy Policies</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="newsletter-wrapper">
                                            <div className="text-wrapper-15">Follow us!</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group-15">
                                    <img className="line" src="/img/line-4.svg" alt="Line" />
                                    <p className="element-furino-all">2024 VGU ReadInspired Club. All rights reserved</p>
                                </div>
                            </div>
                        </div>
                    </footer>
                    <div className="text-wrapper-17">VGUBookInspiredClubLIBER</div>
                    <img className="social-icons" src="/img/social-icons.svg" alt="Social Icons" />
                    <img className="img" src="/img/bookclub-logo-2.png" alt="Bookclub Logo" />
                </div>
            </div>
        </div>
    );
};

export default Allbooks;
