import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`glass ${styles.footer}`}>
      <strong>MERN </strong>
      Chat Application with <strong>Video </strong> and <strong>Voice </strong>{" "}
      calling.
    </footer>
  );
}
