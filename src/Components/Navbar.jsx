import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const Navbar = ({ user, setUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleLogin = async () => {
    // Simulate login functionality
    const fakeUser = {
      displayName: "John Doe",
      photoURL:
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/250/325/75/dam/wdpro-assets/avatars/250x325-circle/circle_avatar_250x325_sorcerer-mickey.png?1699625086868",
    };
    setUser(fakeUser);
  };

  const handleLogout = async () => {
    // Simulate logout functionality
    setUser(null);
  };

  const toggleDropdown = (option) => {
    setDropdownOpen(dropdownOpen === option ? null : option);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${
        isScrolled ? styles.shrink : styles.expand
      }`}
    >
      <ul className={styles.navbarLinks}>
        <li
          className={styles.settings}
          onClick={() => toggleDropdown("settings")}
        >
          <i className="fa-solid fa-gear fa-xl"></i>
        </li>
        {user ? (
          <div className={styles.profileContainer}>
            <div
              className={styles.profilePicture}
              onClick={() => toggleDropdown("user")}
            >
              <img src={user.photoURL} alt="Profile" />
            </div>
          </div>
        ) : (
          <li onClick={handleLogin}>Login</li>
        )}
      </ul>
      {dropdownOpen && (
        <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
          {dropdownOpen === "settings" && (
            <div className={styles.settingsDropdown}>
              <p>App Settings</p>
              <p>Trip Settings</p>
            </div>
          )}
          {dropdownOpen === "user" && (
            <div className={styles.userDropdown}>
              {/* <p>Profile</p> */}
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
