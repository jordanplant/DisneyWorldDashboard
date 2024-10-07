import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";

const Navbar = ({ user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleLogin = async () => {
    const fakeUser = {
      displayName: "John Doe",
      photoURL:
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/250/325/75/dam/wdpro-assets/avatars/250x325-circle/circle_avatar_250x325_sorcerer-mickey.png?1699625086868",
    };
    setUser(fakeUser);
  };

  const handleLogout = async () => {
    setUser(null);
  };

  const toggleDropdown = (option) => {
    setDropdownOpen(dropdownOpen === option ? null : option);
  };

  // Handle clicks outside of the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${
        isScrolled ? styles.shrink : styles.expand
      }`}
    >
      <ul className={styles.navbarLinks}>
        <li className={styles.navHome}>
          <a href='/home'><i className={`fa-solid fa-house ${styles.icon}`}></i></a>
        </li>
        <li className={styles.navSnacks}>
          <i className={`fa-solid fa-utensils ${styles.icon}`}></i>
        </li>
        <li className={styles.navTrips}>
          <i className={`fa-solid fa-suitcase ${styles.icon}`}></i>
        </li>



        {/* <li className={styles.navSettings}
          onClick={() => toggleDropdown("settings")}
        >
          <i className={`fa-solid fa-gear ${styles.icon}`}></i>

          {dropdownOpen === "settings" && (
            <div
              className={`${styles.dropdown} ${styles.dropdownOpen}`}
              ref={dropdownRef}
            >
              <div className={styles.settingsDropdown}>
                <p>App Settings</p>
                <p>Trip Settings</p>
              </div>
            </div>
          )}
        </li> */}
        {user ? (
          <div className={styles.profileContainer}>
            <div
              className={styles.profilePicture}
              onClick={() => toggleDropdown("user")}
            >
              <img src={user.photoURL} alt="Profile" />
              {dropdownOpen === "user" && (
                <div
                  className={`${styles.dropdown} ${styles.dropdownOpen}`}
                  ref={dropdownRef}
                >
                  <div className={styles.userDropdown}>
                    <p>Profile</p>
                    <p onClick={handleLogout}>Logout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <li onClick={handleLogin}>Login</li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
