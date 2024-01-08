import styles from "./CenteredDiv.module.css"

// Just to avoid repeating the common pattern everywhere
export function VerticalCenteredDiv({children}: {children: React.ReactNode}) {
    return (
        <div className={styles.centeredVerticalOuter}>
            <div className={styles.centeredVerticalMiddle}>
                <div className={styles.centeredVerticalInner}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export function HorizontalCenteredDiv({children}: {children: React.ReactNode}) {
    return (
        <div className={styles.centeredHorizontalOuter}>
            { /* Div to ensure only 1  child */}
            {children}
        </div>
    )
}