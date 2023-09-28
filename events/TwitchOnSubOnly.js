const { mClient } = require("..")
module.exports = {
    name: 'TwitchOnSubOnly',
    once: false,
    async execute(channel, enabled) {
        dropTable(channel)
    }
}
async function dropTable(channel) {

    let db = mClient.db("shoutouts")
    let col = db.collection(channel)

    try {
        await col.drop()
    } catch (error) {
        return
    }
}