//express
const express=require('express');
var app = express();
//

//get zahtjev za predmete
app.get('/api/predmeti', (req, res) => {
    
});
//

//Server
const port = 5000;
app.listen(port, () => console.log('Server pokrenut'));
//