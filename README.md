# server-future-open-interest

#backup mongodb database command
mongodump -d nse_futures_bank_nifty -o /home/raj/server-future-open-interest/backup/nse_futures_bank_nifty 


#restore mongodb database command
mongorestore /home/raj/server-future-open-interest/backup/nse_futures_bank_nifty




# 2nd app backup data

#backup mongodb database command
mongodump -d DataAnalysis -o /home/raj/server-future-open-interest/backup/DataAnalysis 


#restore mongodb database command
mongorestore /home/raj/server-future-open-interest/backup/DataAnalysis


DataAnalysis




sudo mongorestore --port=27018 /home/raj/Desktop/future-open-interest/server-future-open-interest/backup/nse_futures_bank_nifty/
