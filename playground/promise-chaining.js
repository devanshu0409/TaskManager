require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('60a3d6375149810b6c08bf4c', {age: 25}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age : 25})
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

const updateAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return {
        user: user,
        count: count
    }
}

updateAndCount('60a3e1b7343ed1062cf057e8', 25).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})