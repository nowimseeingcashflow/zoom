import express from "express";
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');


app.listen(5000);