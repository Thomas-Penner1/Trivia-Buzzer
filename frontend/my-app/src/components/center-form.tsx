import { ReactNode } from "react";
import styles from './center-form.module.css';

import Header from "./header";

interface CenterFormProps {
    children?: ReactNode,
    header?: boolean,
}

export default function CenterForm({ children, header }: CenterFormProps) {
    return (
        <div className={styles.centerFormOuter}>
            <div className={styles.centerFormMiddle}>
                <div className={styles.centerFormInner}>
                    <Header />
                    
                    <div className={styles.centerFormContent}>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    )
}