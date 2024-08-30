import React from 'react'
import { FaGripLines } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "About us", link: "/about-us" },
    { title: "All Books", link: "/all-book" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Details", link: "/details" },
    
  ];

  return (
    <>
    <nav className='flex bg-zinc-800 text-white px-8 py-4 items-center justify-between'>
      <Link to='/' className='flex items-center'>
        <img className='h-10 me-4' src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/457149112_890266963138475_7991011262612897768_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHGe4ESlbzh4fOzBfLbKGJ_-gqXKn4vm_f6Cpcqfi-b91ihh7_xnLOjbQ_g-2OzyGYNTkho30jNQTWz4M8t2ZZZ&_nc_ohc=fU2JkVem3HMQ7kNvgGF8haA&_nc_ht=scontent.fsgn2-6.fna&oh=00_AYBRSsfljQ19Ruethx99V_prLK5AcTUXQDNtfiG8d2cpgQ&oe=66D646FE"
             alt='logo'
        />
        <h1 className='text-2xl font-semibold'>VGU BookInspired</h1>
      </Link>
      <div className='nav-links-bookheaven block md:flex items-center gap-4'>
        <div className='hidden md:flex gap-4'>
          {links.map((link, index) => (
            <Link to={link.link} 
                  className='hover:text-blue-500 transition-all duration-300' 
                  key={index}>
              {link.title}
            </Link>
          ))}
        </div>
        <div className='hidden md:flex gap-4'>
          <Link to='/Signin' className='px-2 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-300'>Sign in</Link>
          <Link to='/Signup' className='px-2 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all'>Sign up</Link>
        </div>
        <button className='text-white text-2xl hover:text-zinc-400'><FaGripLines />
        </button>
      </div>
    </nav>
    <div className='bg-zinc-800 h-screen absolute top-0 left-0 '></div>
    </>
  );
};

export default Navbar