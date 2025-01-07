import styles from "./page.module.css";
import { Search } from "@/app/src/components/Search/search";
import { Logo } from "@/app/src/components/Logo/logo";

export default function Home() {
  return (
    <div className={styles.page}>
      <Logo />
      <Search />
    </div>
  );
}
