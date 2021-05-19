require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('60a3cf212b09480e584ffc10').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false})
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})