# 使用官方的 Node 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 将应用程序的 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# RUN chmod +777 ./package.json

# 安装应用程序的依赖
# RUN npm config set registry registry.npm.taobao.org
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# 将应用程序的源代码复制到容器中
COPY . .

# 暴露端口
EXPOSE 8888

# 设置容器的默认命令
CMD ["npm", "run", "dev"]