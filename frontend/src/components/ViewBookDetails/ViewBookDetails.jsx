import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewBookDetails.css';

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const checkUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };

  const handleAddToCart = async () => {
    try {
      if (!checkUserLoggedIn()) {
        navigate('/signin');
        return;
      }
  
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging line
  
      const addToCartResponse = await axios.post('http://localhost:5000/order/cart/add', {
        bookId: book._id,
        quantity: 1 // Assuming quantity is 1, you can adjust as needed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('Add to cart response:', addToCartResponse.data); // Debugging line
  
      alert('Book added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add book to cart. Please try again.');
    }
  };

  return (
    <div className="single-product-overview">
      <main className="frame-parent">
        <section className="frame-group">
          <div className="rectangle-parent">
            <div className="frame-child"></div>
            <div className="price-stock">

              <div className="rectangle-group">
                <div className="frame-item"></div>
                <img
                  className="asgaard-sofa-3"
                  loading="lazy"
                  alt=""
                  src={book.image}
                />
                {/* Add discount and new labels if needed */}
              </div>
            </div>
            <div className="product-images">
              <div className="product-details-parent">
                <div className="product-details">
                  <h1 className="the-hunger-games-container">
                    <p className="the-hunger-games">{book.title}</p>
                  </h1>
                  <div className="by-suzanne-collins-container">
                    <span>By: </span>
                    <span className="suzanne-collins">{book.author}</span>
                  </div>
                </div>
                <div className="title-author">
                  <div className="parent">
                    <div className="div1">{book.price} đ</div>
                    {book.original_price && (
                      <div className="price-value">
                        <div className="div2">{book.original_price} đ</div>
                      </div>
                    )}
                  </div>
                  <div className="stock-info">
                    <div className="stock-details">
                      <div className="stock-labels">
                        <div className="quantity-in-stock">Quantity in stock</div>
                        <div className="publisher">Publisher:</div>
                        <div className="binding">Pages</div>
                        <div className="share">Share</div>
                      </div>
                      <div className="stock-labels1">
                        <div className="div3">:</div>
                        <div className="div4">:</div>
                        <div className="div5">:</div>
                        <div className="div6">:</div>
                      </div>
                    </div>
                    <div className="stock-values">
                      <div className="stock-data">{book.quantityInStock}</div>
                      <div className="scholastic">{book.publisher}</div>
                      <div className="paperback">{book.pages}</div>
                      <div className="stock-values-inner">
                        <div className="social-icons-parent">
                          {/* Add social media icons here */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="price">
                <div className="rectangle-container">
                  <div className="rectangle-div"></div>
                  <div className="cart-separator-elements">-</div>
                  <div className="div8">1</div>
                  <div className="cart-separator-elements1">+</div>
                </div>
                <button className="group-button" onClick={handleAddToCart}>
                  <div className="frame-child1"></div>
                  <div className="add-to-cart">Add To Cart</div>
                </button>
              </div>
            </div>
          </div>
          <div className="group-div">
            <div className="frame-child2"></div>
            <div className="frame-container">
              <div className="line-parent">
                <div className="line-div"></div>
                <div className="frame-wrapper">
                  <div className="overview-parent">
                    <a className="overview">Overview</a>
                    <h3 className="additional-information">
                      Additional Information
                    </h3>
                  </div>
                </div>
              </div>
              <div className="could-you-survive-on-your-own-wrapper">
                <h3 className="could-you-survive-container">
                  <p className="could-you-survive">
                    {book.description}
                  </p>
                </h3>
              </div>
            </div>
            <div className="frame-child3"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewBookDetails;