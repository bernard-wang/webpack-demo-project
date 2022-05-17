import type { ReactElement } from 'react';
import { Fragment } from 'react';
import styles from './app.css';

export function App(): ReactElement {
  return (
    <Fragment>
      <div className={styles.hello}>hello, world</div>
    </Fragment>
  );
}
