import React from "react";
import styles from "./Main.module.css";

export default function Main({ children }) {
  return (
    <main>
      <div className={`${styles.main} m-md-2 m-1`}>
        <div className="glass m-1 p-lg-2 p-2 d-flex justify-content-center align-items-center flex-column">
          {children}
        </div>
      </div>
    </main>
  );
}
