import React from 'react';
import { Link } from 'react-router-dom';

// Define styles as JavaScript objects
const styles = {
  frameWrapper: {
    position: 'absolute',
    width: '1163px',
    height: '80px',
    top: '34px',
    left: '148px',
    backgroundColor: '#f8eded',
    borderRadius: '18px',
    border: '1px solid',
    borderColor: '#000000'
  },
  frame: {
    display: 'flex',
    width: '1163px',
    height: '80px',
    alignItems: 'center',
    gap: '99px',
    position: 'relative',
    top: '-1px',
    left: '-1px'
  },
  bookclubLogo: {
    position: 'relative',
    width: '114px',
    height: '114px',
    marginTop: '-17px',
    marginBottom: '-17px',
    objectFit: 'cover'
  },
  textWrapper: {
    position: 'relative',
    width: 'fit-content',
    fontFamily: '"Inter", Helvetica',
    fontWeight: '500',
    color: '#000000',
    fontSize: '24.3px',
    letterSpacing: '0',
    lineHeight: '34.7px',
    whiteSpace: 'nowrap'
  },
  icon: {
    position: 'relative',
    width: '18px',
    height: '20px'
  },
  akarIconsSearch: {
    position: 'relative',
    width: '28px',
    height: '28px'
  },
  vector: {
    position: 'relative',
    width: '24.53px',
    height: '22.06px'
  }
};

const Navbar = () => {
  return (
    <div style={styles.frameWrapper}>
      <div style={styles.frame}>
        <Link to="/">
          <img
            style={styles.bookclubLogo}
            src="img/bookclub-logo-2-1.png"
            alt="Book Club Logo"
          />
        </Link>
        <Link to="/" style={styles.textWrapper}>Main page</Link>
        <Link to="/agenda" style={styles.textWrapper}>Agenda</Link>
        <Link to="/" style={styles.textWrapper}>Book store</Link>
        <Link to="/profile">
          <img
            style={styles.icon}
            src="img/icon.svg"
            alt="Profile Icon"
          />
        </Link>
        <img
          style={styles.akarIconsSearch}
          src="img/akar-icons-search-1.svg"
          alt="Search Icon"
        />
        <Link to="/cart">
          <img
            style={styles.vector}
            src="img/vector.svg"
            alt="Cart Icon"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
