import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={`${styles.header} glass`}>
      <h1 className={styles.heading}>Chit-Chat</h1>
    </header>
  );
}
