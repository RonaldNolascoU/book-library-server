const {
    MONGOBD_ADMIN_PASWORD = '',
    MONGOBD_CLUSTER_URL = '',
    MONGOBD_USER = '',
    NODE_ENV = ''
  } = process.env
  
  const DB_CONNECTION = {
    local: `mongodb://localhost:27017/book-library?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
    production: `mongodb+srv://${MONGOBD_USER}:`
      .concat(MONGOBD_ADMIN_PASWORD)
      .concat(MONGOBD_CLUSTER_URL)
  }
  
  export const db = DB_CONNECTION[NODE_ENV as keyof typeof DB_CONNECTION] || DB_CONNECTION.local
  