import React, { useState } from 'react';
import axios from 'axios';
import '../components/Profile/Profile.css'; 

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    facebook_link: '',
    dormColor: '',
    roomNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Customer data saved:', response.data);
    } catch (error) {
      console.error('Error saving customer data:', error);
    }
  };

  return (
    <div className="cart">
      <section className="frame-parent">
        <div className="wrapper-rectangle-1-parent">
          <div className="wrapper-rectangle-1">
            <img className="wrapper-rectangle-1-child" alt="" src="/rectangle-1@2x.png" />
          </div>
          <div className="cart-wrapper">
            <h1 className="cart1">Profile</h1>
          </div>
        </div>
        <div className="rectangle-parent">
          <div className="frame-child"></div>
          <form onSubmit={handleSubmit} className="frame-group">
            <div className="frame-container">
              {['name', 'phoneNumber', 'facebook_link', 'dormColor', 'roomNumber'].map((field) => (
                <div key={field} className="frame-div">
                  <div className="the-hunger-games-the-hunger-g-parent">
                    <div className="the-hunger-games-container">
                      <p className="the-hunger-games">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                    <input
                      type={field === 'phoneNumber' ? 'tel' : field === 'facebook_link' ? 'url' : field === 'roomNumber' ? 'number' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="rectangle-container"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="frame-wrapper1">
              <button type="submit" className="group-button">
                <div className="frame-child2"></div>
                <div className="check-out">Save Profile</div>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;