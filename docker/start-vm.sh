#!/bin/sh
export SUBSCRIPTION_ID="760023ca-b3b7-42f1-8632-d8ad64679595"

docker-machine create -d azure \
    --azure-subscription-id $SUBSCRIPTION_ID \
    --azure-ssh-user alesja \
    --azure-open-port 80 \
    --azure-size "Standard_D2_v2" \
    senseira
