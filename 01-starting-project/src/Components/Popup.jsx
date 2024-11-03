import { Dialog } from "primereact/dialog";
import classes from "../ComponentsCss/Popup.module.css"

export default function Popup({ visible, onHide, children }){
    return (
        <Dialog
            header="STOCK HOUSE"
            visible={visible}
            className={classes.customDialog}
            onHide={onHide}
            dismissableMask
        >
            {children}
        </Dialog>
    );
}