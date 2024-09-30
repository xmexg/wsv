# wsv

wsv(vite) 
前身: https://github.com/xmexg/wkyd  

wkyd: 最初的某软件逆向笔记及实现, 现分割为wsv(vite)和wsv(springboot)两部分  
wsn(vite): 专注于wkyd的前端页面  
wsn(springboot): 专注于wkyd的后端加解密算法,闭源  
 
# 开始
+ 安装依赖

```sh
npm install
```

+ 开发运行

```sh
npm run dev
```

+ 构建

```sh
npm run build
```

+ 部署
    - 使用`serve`或`http-server`
    ```sh
    npm install -g serve
    serve -s dist

    或
    npm install -g http-server
    http-server dist
    ```

    - 使用`Apache/Nginx` `GitHub Pages` `Netlify/Vercel`等平台运行