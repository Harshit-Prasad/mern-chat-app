import React from "react";
import styles from "./Skeleton.module.css";

export default function SearchSidebarSkeleton({ style }) {
  return <div style={style} className={`${styles.skeleton}`}></div>;
}
