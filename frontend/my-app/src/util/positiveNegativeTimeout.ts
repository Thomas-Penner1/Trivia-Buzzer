export function PostiveNegativeTimeout(
        positiveCallback: () => void, 
        negativeCallback: () => void, 
        time?: number) {

    let timeout: NodeJS.Timeout | undefined = setTimeout(positiveCallback, time);

    return () => {
        clearTimeout(timeout);
        timeout = undefined;

        negativeCallback();
    }
}