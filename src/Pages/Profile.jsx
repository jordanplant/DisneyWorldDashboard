import React from "react";
import styles from "./Pages.module.css";

const Profile = ({ user, setUser }) => {
  return (
    <>
      <main>
        <div className={styles.cardContainers}>
          <div className={`${styles.card}`}>
            <div className={styles.profileDetails}>
              {user ? (
                <>
                  <img
                    className={styles.profileAvatar}
                    src={user.photoURL}
                    alt="User Avatar"
                  />
                  <h3 className={styles.profileDisplayName}>
                    {user.displayName}
                  </h3>
                  <div className={styles.memberStatusRoleContainer}>
                    <h4
                      data-label="Founder"
                      className={styles.memberStatusRole}
                    ></h4>
                  </div>

                  <p className={styles.memberStatusDate}>Since October 2024</p>
                  <div
                    onClick={() => setUser(null)}
                    className={styles.appLogout}
                  >
                    <span>
                      <p>Log out</p>
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </span>
                  </div>
                </>
              ) : (
                <div>No user info</div>
              )}
            </div>

            <div className={styles.profileStats}></div>
            <h2>Your Trips</h2>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
