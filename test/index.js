//express
const express=require('express');
var app = express();
//

//get zahtjev za predmete
app.get('/api/predmeti', (req, res) => {
    const predmeti = [
        {naziv: 'Softverski inženjering', br_studenata: 150},
        {naziv: 'Logički dizajn', br_studenata: 165},
        {naziv: 'Računarske arhitekture', br_studenata: 170}
    ];
    res.status(200);
    res.json(predmeti);
});
//

//Server
const port = 3001;
app.listen(port, () => console.log('Server pokrenut'));
//

module.exports = app;