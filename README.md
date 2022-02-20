## Setup

```bash
cd ~/api-demo/ && npm i && npm run bootstrap && npm run build

cd ~/api-demo/contracts && npm run compileSol
```

## Test

```bash
# In terminal 1
cd ~/api-demo/contracts && npm run hardhat

# In terminal 2
cd ~/api-demo/server && node index.js

# In terminal 3
cd ~/api-demo/server && ./test.sh <tokenId>  # for example: ./test.sh 1
```
