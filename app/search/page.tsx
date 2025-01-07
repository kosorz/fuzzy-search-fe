import styles from "./page.module.css";
import { Search } from "@/app/src/components/Search/search";
import { Results } from "@/app/src/components/Results/results";

export default function Result() {
  return (
    <div className={styles.page}>
      <Search autofocus={false} className={styles.search} />
      <Results />
    </div>
  );
}
