import React from "react";
import styles from "./Pages.module.css";

const Profile = ({ user, setUser }) => {
  return (
    <>
      <main>
        <div className={styles.cardContainers}>
          <div className={`${styles.titleBar} ${styles.card}`}>
            <div className={styles.profileDetails}>
              {user ? (
                <>
                  <img className={styles.profileAvatar} src={user.photoURL} alt="User Avatar" />
                  <h3>{user.displayName}</h3> {/* Display name */}
                </>
              ) : (
                <div>No user info</div>
              )}
            </div>
          </div>
        </div>

        <div>Profile</div>
        <div>Settings</div>
        <div onClick={() => setUser(null)}>Logout</div> {/* Logout logic */}
      </main>
    </>
  );
};

export default Profile;
