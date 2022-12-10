
```
real
├─ .DS_Store
├─ .browserslistrc
├─ .gitignore
├─ babel.config.js
├─ build
│  ├─  webpack.base.js   #公共配置
│  ├─ webpack.analy.js   
│  ├─ webpack.dev.js
│  └─ webpack.prod.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  └─ index.html   #html模板
├─ src
│  ├─ .DS_Store
│  ├─ App.tsx
│  ├─ app.css
│  ├─ app.less
│  ├─ asset
│  ├─ components
│  ├─ images.d.ts
│  └─ index.tsx
└─ tsconfig.json
  //-c是为webpack指定一个配置文件，默认配置文件是webpack.config.js，可以通过-c指定配置文件，--config也可以。
```