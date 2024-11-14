import spinnerStyles from "../ComponentsCss/Spinner.module.css";
export default function Spinner(){
    return (
        <div className={spinnerStyles["spinner-overlay"]}>
          <div className={spinnerStyles.spinner}></div>
        </div>
    )
}