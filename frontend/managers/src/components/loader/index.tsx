import styles from './loader.module.css';

export function Loader () {
  return (
    <div className={`${styles.loader} flex self-center justify-self-center`}/>
  )
}