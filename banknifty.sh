#!/bin/sh
#https://stackoverflow.com/questions/27238411/display-curl-output-in-readable-json-format-in-unix-shell-script
while true  
do  
  echo "API CALLED"
	IP=$(curl -i -H "Accept: application/json" 'http://localhost:7000/api/nse/banknifty')
	IP1=$(curl -i -H "Accept: application/json" 'http://localhost:7000/api/nse/nifty')
	IP2=$(curl -i -H "Accept: application/json" 'http://localhost:7000/api/nse/bankniftyOptionChain')

	echo "$IP"
	echo "$IP1"
   
  sleep 90  
done
