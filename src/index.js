import app from './App'
import { dbConnection } from '../src/db';
import { config } from './config';


const port = config.PORT;

app.listen(port, (err) => {
  new dbConnection().getInstance();
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
