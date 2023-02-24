#!/bin/bash

cd $(dirname $0);
cd ..
CURRENT=$(pwd)
/usr/bin/php $CURRENT/artisan Ws:Start
