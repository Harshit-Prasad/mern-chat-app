import React from "react";
import styles from "./Skeleton.module.css";

export default function SearchSidebarSkeleton({ length }) {
  return Array.from({ length }).map((_, i) => (
    <div key={i} className={`${styles.skeleton}`}></div>
  ));
}
