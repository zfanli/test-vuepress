# Verdaccio

## 介绍

Verdaccio 是一个轻量级的 NPM 代理源，基于 Node.js 构建。

::: tip 官方定义

- Verdaccio 是一个 Node.js 的网页应用
- Verdaccio 是一个 NPM 私有源
- Verdaccio 是一个本地网络代理
- Verdaccio 是一个可插拔应用
- Verdaccio 的安装和使用非常简单
- 提供 Docker 和 Kubernetes 支持
- 与 `yarn`、`npm` 和 `pnpm` 100% 兼容
- Verdaccio 是中世纪晚期意大利壁画中流行的一种绿色

:::

## 安装

### 通过 `npm` 安装

可以使用 `npm` 直接安装使用。

```shell
# use npm
npm install -g verdaccio

# or use yarn
yarn global add verdaccio
```

安装完成后，执行下面命令启动。

```shell
verdaccio
```

代码仓库根目录添加 `.npmrc` 文件，写入下面内容。

```ini
registry=http://localhost:4873
```

### 通过 Docker 安装

下面是预览命令，建立一个关闭即删除的实例。正常部署还需要设置挂载 volume。

```shell
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

## 配置

Verdaccio 通过文件配置，使用 Docker 安装时，配置文件在容器内 `/verdaccio/conf/config.yaml` 路径。

默认情况 Verdaccio 的配置已经足够使用，其账号管理简单使用 `htpasswd` 来实现，这部分设置在配置文件以下部分定义。

```yml
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    # Maximum amount of users allowed to register, defaults to "+infinity".
    # You can set this to -1 to disable registration.
    # max_users: 1000
```

容器内 `/verdaccio/storage/htpasswd` 路径用来储存账号密码。可以通过命令行在这个路径创建一个文件，然后添加需要的账号进入，一行表示一个用户。

账号和加密后的密码可以通过 [这个地址](https://hostingcanada.org/htpasswd-generator/) 在线生成。

而 Verdaccio 的灵活之处在于，认证模块是插件化的，Verdaccio 只是默认使用了 `htpasswd`，如果你需要其他认证方式，你可以使用社区插件，或者根据官方教程自己实现认证模块。

## 发布 NPM 包

登陆到 Verdaccio，然后发布。

```shell
# 登陆到 Verdaccio ，输入 htpasswd 中定义的账户和密码
npm login --registry=http://localhost:4873
# 发布 NPM 包
npm publish
```

## 参考

- [Verdaccio 官方文档](https://verdaccio.org/docs/what-is-verdaccio)
- [Htpasswd Generator – Create htpasswd](https://hostingcanada.org/htpasswd-generator/)
