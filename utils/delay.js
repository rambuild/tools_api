async function delay(time) {
    return new Promise((resolve) => {
        setInterval(() => {
            resolve();
        }, time)
    })
}
module.exports = delay