import { ReactNode } from "react";
import styles from './background.module.scss';

interface BackgroundProps {
    children?: ReactNode,
}

/*
 * WARNING:
 * This code is coupled with the corresponding scss file, due to the requirement
 * to match the generated classes. We have n randomly generated sphere classes,
 * so we must have:
 * nSpheres >= nSmall + nMedium + nLarge + nExtraLarge
 */
export default function Background ({children}: BackgroundProps) {
    const nSmall = 40;
    const nMedium = 15;
    const nLarge = 5;

    // Dummy arrays - for mapping later on
    const smallSpheres = Array(nSmall).fill(1);
    const mediumSpheres = Array(nMedium).fill(1);
    const largeSpheres = Array(nLarge).fill(1);

    return (
        <div className={styles.background}>
            <div className={styles.sphereWrapper}>
                <div className={styles.smallSphereWrapper}>
                    {
                        smallSpheres.map((element, index) =>
                            <div key={index} className={`${styles.sphere} ${styles[`sphere-${index}`]} ${styles.small}`}></div>
                        )
                    }
                </div>

                <div className={styles.mediumSphereWrapper}>
                    {
                        mediumSpheres.map((element, index) =>
                            <div key={index} className={`${styles.sphere} ${styles[`sphere-${index + nSmall}`]} ${styles.medium}`}></div>
                        )
                    }
                </div>

                <div className={styles.largeSphereWrapper}>
                    {
                        mediumSpheres.map((element, index) =>
                            <div key={index} className={`${styles.sphere} ${styles[`sphere-${index + nSmall + nMedium}`]} ${styles.large}`}></div>
                        )
                    }
                </div>
            </div>

            
            <div className={styles.backgroundInner}>
                {children}
            </div>
        </div>
    )
}