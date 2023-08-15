/*
 * Generate a new passcode for a room, and formats it as a string
 * to pass to the front end
 * 
 * TODO: allow this method to have access to all currently active
 * passcodes, and prevent creating a new one. This shouldn't be an
 * issue with the current format
 */
function generateRoomPassword() {
    // NOTE: this may be etter to move to a spec file
    const N_DIGITS = 8;
    const MAX = 10 ** N_DIGITS;

    let value = Math.floor(Math.random() * MAX);

    let str_value = value.toString();

    // Ensure that all passwords are the same length in the event
    // that we have one that is too short
    if (str_value.length < N_DIGITS) {
        str_value = "0".repeat(N_DIGITS - str_value.length) + str_value;
    }

    return str_value;
}

module.exports = {
    generateRoomPassword,
}