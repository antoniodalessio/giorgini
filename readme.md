ssh -p 2022 6263c5b0847fb8966011d5fe0838835c10538df998e18cfa20b419a810173057c87438@devshell.cloudno.de

mongodb://antonio.dalessio:1QyxqMm0rC@mongodb.cloudno.de:27017


mongodump -d amaliacardo -o ./dump
/Users/antoniodalessio/Desktop/workspace/amaliacardo-admin/dump/amaliacardo


scp -r /Users/antoniodalessio/Desktop/workspace/amaliacardo-admin/dump/amaliacardo antonio.6263c5b0847fb8966011d5fe0838835c10538df998e18cfa20b419a810173057c87438@devshell.cloudno.de:/mnt/dump/amaliacardo


scp -r /Users/antoniodalessio/Desktop/workspace/amaliacardo-admin/dump/amaliacardo /mnt/dump


Your API token is 6HZ2ln8VUT - keep it secrect!
Your CouchDB/MongoDB token is 1QyxqMm0rC - keep it secrect!



ssh -L27017:localhost:27017 6263c5b0847fb8966011d5fe0838835c10538df998e18cfa20b419a810173057c87438@devshell.cloudno.de:27017


mongodump -h mongodb_1:27017 -d amaliacardo -u antonio.dalessio -p 1QyxqMm0rC -o amaliacardo

// import dump funzionante
// passare prima i files con filezilla
mongorestore -h mongodb_1:27017 -d amaliacardo -u antonio.dalessio -p 1QyxqMm0rC /mnt/dump


http://amaliacardo.cloudno.de/authenticate