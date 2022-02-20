#!/bin/bash

./admin.sh deploy
./user.sh mint -a 0x627306090abab3a6e1400e9345bc60c78a8bef57  -x 0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0 -i $1

./user.sh transfer -f 0x627306090abab3a6e1400e9345bc60c78a8bef57 -t 0xf17f52151ebef6c7334fad080c5704d77216b732 -x 0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0 -i $1
