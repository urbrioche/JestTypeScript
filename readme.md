# Jest and TypeScript
## 環境建置
+ 參考資料: https://titangene.github.io/article/jest-typescript.html
+ 步驟
  + 建立 npm 專案
    + npm init -y
  + 安裝TypeScript
    + npm install -D typescript
  + 安裝與 Node.js 和 TypeScript 相關的環境
    + npm install -D ts-node nodemon @types/node
  + 安裝與 Jest 和 TS 相關的環境
    + npm install -D jest ts-jest @types/jest
  + 設定 jest.config.js
    + npx ts-jest config:init
      + 目前使用預設配置，沒有加東西 
  + 設定 tsconfig.json
    + tsc --init
      + 目前使用預設配置，沒改東西，Type Checking用最嚴格的strict，其他沒關掉
