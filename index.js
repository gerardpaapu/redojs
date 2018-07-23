exports.redoIfChange = async function (...files) {
    if (!process.env.REDO_DB) {
        throw new Error('$REDO_DB not set');
    }

    if (!process.env.REDO_TARGET) {
        throw new Error('$REDO_TARGET not set');
    }

    // Do some shit
};