function check_testing () {
    return process.env.JEST_WORKER_ID !== undefined;
}

export default check_testing;