import React from "react";
import styles from "./Header.module.css";

export default function Header({ children }) {
  return <header className={`${styles.header} glass`}>{children}</header>;
}
