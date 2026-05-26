# DDL 倒计时 App

## 技术栈
- React Native + Expo SDK 54
- Expo Router（文件路由）
- Zustand + AsyncStorage（状态管理 + 持久化）
- TypeScript
- 优先适配 Android

## 项目结构
```
app/         # Expo Router 页面（_layout.tsx, index.tsx, add.tsx）
src/
  components/  # DdlCard, EmptyState
  store/       # ddlStore.ts（Zustand + persist）
  types/       # Ddl, DdlStatus
  utils/       # 倒计时计算、ID 生成
  constants/   # 主题颜色/间距（含深色模式）
```

## 启动方式
```
npm install --legacy-peer-deps
npx expo start
```
然后用 Expo Go（SDK 54）扫码运行。

## Git 推送
- 用 GitHub Desktop 推送（命令行被墙）
- 仓库：github.com/sure-660322/ddl-app

## 关键约定
- 包管理用 npx expo install（不用 npm install 直接装原生包）
- 所有交互元素加 testID
- Header 文案用中文
