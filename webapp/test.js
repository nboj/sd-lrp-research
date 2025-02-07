import * as fs from 'fs';

fs.readFile('./lrp2a-23_scores.txt', 'utf8', (err, data) => {
    const scores = data.split('\n').slice(1, 6);
    console.log(scores);
})
