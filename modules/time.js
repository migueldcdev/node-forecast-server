const now = new Date()

const todayPlusThreeDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
todayPlusThreeDays.setHours(1)

const unixTimestamp = todayPlusThreeDays / 1000


module.exports = { unixTimestamp }





