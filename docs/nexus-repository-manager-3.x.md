# Nexus Repository Manager 3.x

## 简介

Nexus Repository Manager 是 Sonatype 公司旗下 Nexus 平台中的依赖库管理工具。

这个工具

- 基于 Java 开发
- 出厂自带 Java 世界的 Maven 私有仓库
- 以及 .Net 世界的 NuGet 私有仓库

而用其来配置 NPM 的私有源，最大的原因还是希望复用现存系统，不额外增加运维成本。

> 如果不需要考虑运维因素，使用 Verdaccio 来配置 NPM 私有仓库更加方便。

这个工具分为开源版（OSS 版）和收费版（Pro 版）。

::: tip OSS 对应 Open-source Software，指开源版本的软件，功能如下：

- 基础的库管理功能
  - 库的存储
  - 路由规则
  - 库的清除
- 支持众多格式的库管理
- 备份和恢复

:::

::: tip Pro 版本在 OSS 版本上追加了下面功能：

- 适用于 Cloud 的选项，比如 Azure Blog 存储
- 针对弹性部署的选项
- 支持外部 PostgreSQL 数据库选项
- 导入和导出
- 支持分布式部署发布库时复制到每个实例
- 支持模拟生产环境的临时系统和标签
- Blob 分组存储
- 变更库的 Blob 存储
- 强化库的运行状况检查（Health Check）
- SAML 和单点登录（SSO）
- 支持用户 Token
- 官方的企业支持

:::

方便起见，本文中的描述在没有明确说明的情况下，“Nexus” 均指代 Nexus Repository Manager OSS 版本。

## 通过 Docker 安装

官方提供了 Docker 镜像可以简化安装步骤，本文使用此方法进行 Nexus 的安装。

```shell
# 创建一个 volume 保存持久化的数据
docker volume create --name nexus-data

# 创建一个 Nexus 实例并暴露在 8081 端口上
docker run -d -p 8081:8081 --name nexus -v nexus-data:/nexus-data sonatype/nexus3
```

Nexus 实例创建完成之后，有一个初始化过程。这个过程可能需要几分钟时间来完成，你可以查看 Nexus 的运行 log 来判断其是否完成初始化。

```shell
# 查看实时 log
docker logs -f nexus

# 出现以下 log 表示初始化完成
...
-------------------------------------------------

Started Sonatype Nexus OSS 3.37.1-01

-------------------------------------------------
```

Nexus 初始化完成之后，通过 [`localhost:8081`](http://localhost:8081) 可以打开 Nexus 首页。

### Docker 安装的注意点

- `$install-dir`

  使用 Docker 安装 Nexus，安装目录为容器内的 `/opt/sonatype/nexus` 目录，对应官方文档中的 `$install-dir` 目录。

- `$data-dir`

  容器内目录 `/nexus-data` 用来处理配置、log 和存储，将该目录映射到 volume 或文件系统可以将数据持久化，对应官方文档的 `$data-dir` 目录。

- 支持的环境变量等其他信息

  支持的环境变量等其他信息参考[官方镜像说明](https://hub.docker.com/r/sonatype/nexus3/)。

### 安装后 Checklist

官方提示了几个安装后应该做的步骤让安装完整并安全。

1. **修改 admin 随机密码**

   Nexus Repository Manager 为确保安全，在初始化过程中会在 `$data-dir` 中生成一个文件 `admin.password`，并向其中写入随机生成的管理账户的密码。在配置 Nexus 系统时，用户需要从文件系统中拿到这个初始密码来证明其为该系统的拥有者。这个密码可通过 UI 或 REST API 进行修改。

   通过以下命令，我们可以从容器中获得初始密码来继续 Nexus 系统的配置。

   ```shell
   # 进入容器
   docker exec -it nexus bash

   # 在容器内查看初始密码
   cat /nexus-data/admin.password
   ```

   拿到密码后，打开 [`localhost:8081`](http://localhost:8081)，点击左上角的 Sign in 按钮，输入用户名 admin 和刚才拿到的密码登陆，接下来就开始了 Nexus 系统的首次配置过程。

2. **配置匿名访问权限**

   在 Nexus 系统配置向导中会对匿名访问权限进行设置。需要注意的是，除非用户主动设置，否则系统会允许未认证的用户读取仓库内容。

3. **修改管理邮箱地址**

   管理员账号有一个默认邮箱地址配置，这可能不是你希望的地址，你需要通过账号设置对其进行修改。

4. **发件邮箱 SMTP 配置**

   Nexus 可以发生邮件来找到用户名或恢复密码。你需要完成 SMTP 主机地址和端口设置让 Nexus 可以接入邮件服务器来开启这个功能。

5. **HTTP 和 HTTPS 代理设置**

   要允许 Nexus 访问需要通过 HTTP 或 HTTPS 代理才能访问的公司内部的远程仓库时，你需要正确设置代理服务器来让 Nexus 系统可以正常访问到远程地址。

6. **为你的服务器设置备份处理**

   建议定期备份你的配置和数据。参考官方文档的[备份和恢复](https://help.sonatype.com/repomanager3/planning-your-implementation/backup-and-restore)章节。

### Nexus 初始配置

从容器内的文件系统获取到 Nexus 系统的初始密码，打开创建容器时指定的地址（端口） [`localhost:8081`](http://localhost:8081)，从 Nexus 的 UI 界面左上角选择 Sign in 进行登陆。

登陆后会启动一个简单的配置向导，引导你修改管理员账号的密码、设置是否允许匿名访问。

## 配置 NPM 私有源

使用 Nexus 达到

- 提供内部私有源
- 统一官方源和私有源的入口
- 统一设置官方源镜像

的目的，方便在公司内部交付公共库，也方便依赖包的安装，减少公网带宽和占用（虽然没必要考虑 XD）和下载等待时间。

### 配置 NPM 官方源代理

添加一个 NPM 国内镜像源。

在 `Repository` -> `Create Repository` 选择 `npm (proxy)`，进入添加 NPM 仓库的配置页面。添加下面配置。点击下方的 `Create repository` 即可添加这个镜像源。

| 配置项         | 配置值                          |
| -------------- | ------------------------------- |
| Name           | npm-mirrored                    |
| Remote storage | http://registry.npm.taobao.org/ |

![创建 NPM 官方镜像源](/nexus/create-proxy-npm-registry.png)

### 配置 NPM 私有源

在 `Repository` -> `Create Repository` 选择 `npm (hosted)`，进入添加 NPM 仓库的配置页面。添加下面配置。点击下方的 `Create repository` 即可添加这个私有源。

| 配置项 | 配置值       |
| ------ | ------------ |
| Name   | npm-internal |

![创建 NPM 私有源](/nexus/create-hosted-npm-registry.png)

### 使用仓库组暴露官方源和私有源

在 `Repository` -> `Create Repository` 选择 `npm (group)`，进入添加 NPM 仓库的配置页面。添加下面配置。点击下方的 `Create repository` 即可添加这个仓库组。

| 配置项              | 配置值                                                                                |
| ------------------- | ------------------------------------------------------------------------------------- |
| Name                | npm-entrypoint                                                                        |
| Member repositories | npm-internal<br>npm-mirrored<br>\* Nexus 按照从上至下的顺序定位组件，这里的顺序很重要 |

![创建 NPM 仓库组](/nexus/create-npm-registry-group.png)

### 配置代码仓库

简单配置完 Nexus，我们需要配置代码仓库让 `npm` 和 `yarn` 命令知道该从 Nexus 仓库拉取依赖包。

配置很简答， 我们只需要在代码仓库的根目录下添加一个 `.npmrc` 文件，写入以下内容即可。如果你将 Nexus 部署在某个服务器上，记得修改 `localhost` 为具体的服务器地址。

```shell
registry=http://localhost:8081/repository/npm-entrypoint/
```

接下来，执行 `npm install` 或 `yarn` 命令时，包管理工具就会知道从 Nexus 仓库定位依赖包了。

## 发布 NPM 包到私有源

### 让 Nexus 支持 `npm login`

要发布一个包到私有源上，我们先要登陆这个私有源才能执行 `publish` 命令。Nexus 可以简单设置支持 `npm login` 命令。

在 Nexus 管理面板选择 `Security` -> `Realms` 页面，将 Available 中的 `npm Bearer Token Realm` 添加到 Active，点击 `Save` 即可。

![添加 npm Bearer Token Real](/nexus/nexus-npm-Bearer-Token-Realm.png)

现在我们已经准备好发布 NPM 包到私有源了。

### 仓库组的发布限制

我们配置了 `npm-entrypoint` 作为 NPM 的源，但是这是一个仓库组，发布 NPM 包到仓库组是 Pro 版本的功能，使用 OSS 版本时我们只能使用其他方法。

#### 发布非 scoped NPM 包

当需要发布的 NPM 包并非 scoped 时，可以修改 `.npmrc` 内容为

```shell
registry=http://localhost:8081/repository/npm-internal/
```

即可发布包到私有源上。不过这样不是很灵活，我们不再能访问到 `npm-mirrored` 了。

这时我们还是有多个选择，首先我们可以依然使用 `npm-entrypoint`，我们恢复 `.npmrc` 的设置为

```shell
registry=http://localhost:8081/repository/npm-entrypoint/
```

然后使用下面的命令来发布 NPM 包到 `npm-internal` 上。

```shell
# 登陆到私有源，按照提示输入用户名、密码和邮箱
npm login --registry=http://localhost:8081/repository/npm-internal/

# 发布 NPM 包到私有源
npm publish --registry=http://localhost:8081/repository/npm-internal/
```

#### 发布 scoped NPM 包

或者，我们可以将需要发布的 NPM 包放在一个 scope 下，然后指定这个 scope 的源。比如我们将需要发布的包放在 `@test-scope` 下，这时要指定这个 scope 的源，修改 `.npmrc` 为

```shell
registry=http://localhost:8081/repository/npm-entrypoint/
@test-scope:registry=http://localhost:8081/repository/npm-internal/
```

这时使用下面的命令就可以发布 NPM 包到私有源上。

```shell
# 指定登陆到私有源
npm login --registry=http://localhost:8081/repository/npm-internal/

# 发布 NPM 包默认到私有源
npm publish
```

## Nexus 定义的概念和术语解释

要深入了解 Nexus，可以从阅读 Nexus 的官方文档开始。

要理解 Nexus 的文档需要先理解一些官方文档的用词，诸如 Component（组件）、Repository（仓库）和 Repository Format（仓库格式）等术语的使用，和我们日常开发过程中的用法，或对依赖管理工具的理解都有一定的差异。

我们先来看看这些术语官方是如何定义的。

### `Component` 组件

官方文档定义 `component` （组件）与我们日常理解的依赖包在概念上等同。这个概念在其他工具链中可能被叫做 `artifact`（Maven 等）、`package`（NPM 等）、`bundle`、`archive` 等术语。

> In different tool-chains components are called artifact, package, bundle, archive and other terms. The concept and idea remains the same and **component is used as the generic term**.

更细致的解释的话，就是作为软件应用的运行时、集成、单元测试执行时、构建等过程的一部分使用的库或框架。格式体现为多种文件格式压缩成指定格式的压缩包或可执行文件。

组件通常是通过组名、组件名和版本来标识和定位，这些元数据在不同工具链中叫法也是不同的。

### `Assets` 资源

`Assets` （资源）没有很明确对应我们日常开发中的某个概念。简单来说就是构成组件的细分。

### `Repository` 仓库

`Repository` （仓库）的概念等同与我们平常所说的“源”。举例来说就是 Maven 的中央仓库、NPM 的官方源相同的概念。

细致解释的话，是指为了方便分发和管理依赖包，将各种包聚合到一起集中管理，通常作为一种服务在网络上公开，一般由各语言官方提供，或由开源社区维护，被各平台的包管理工具、构建工具和 IDE 使用。

### `Repository Format` 仓库格式

不同仓库使用不同技术储存和暴露组件。`Repository Format`（仓库格式）定义了各种工具如何与仓库交互。

换成人话就是定义了包是如何储存在仓库的：是依赖特定目录结构，还是依赖特定的数据库；以及定义了包管理工具如何与仓库互动：是通过简单的 SOAP 请求完成，还是通过 REST API 完成。

## Nexus 的仓库类型

### 代理仓库 Proxy Repository

代理仓库用来在本地无法找到请求的依赖时向远程仓库发生请求。拉取过一次的依赖包会被缓存到本地，后续拉取相同依赖包时就不会走远程仓库，以此减少带宽占用和等待时间。

> Nexus 出厂自带以下代理仓库的配置：
>
> - **maven-central**
>
>   Apache Maven 的中央仓库，Java 世界的依赖管理仓库。
>
> - **nuget.org-proxy**
>
>   NuGet Gallery 代理仓库。.Net 世界的依赖管理仓库。

### 托管仓库 Hosted Repository

托管仓库即私有仓库。

> Nexus 出厂自带以下私有仓库的配置：
>
> - **maven-releases**
>
>   Java 世界的 Maven 私有仓库，使用 release 版本策略，用来做内部发布，或者内部发布第三方收费依赖包。
>
> - **maven-snapshots**
>
>   同样 Maven 私有仓库，使用 snapshots 版本策略，用来做内部开发版本发布。
>
> - **nuget-hosted**
>
>   .Net 世界的私有仓库，用来做内部发布，或者内部发布第三方收费依赖包。

### 仓库组 Repository Group

仓库组用来将多个仓库地址聚合成一个地址，这样做的好处是无论管理员如何编辑代理仓库或私有仓库，只要仓库组的地址不变，这些更改对开发者就是无感知的。开发者只需要设置一个地址就可以正常访问到私有仓库和公开仓库了。

> Nexus 出厂自带以下仓库组配置：
>
> - **maven-public**
>
>   这个仓库组整合了 Maven 中央仓库、Nexus 托管的 Maven release 仓库和 snapshots 仓库。允许用户仅通过一个地址访问到公开和私有的包。
>
> - **nuget-group**
>
>   这个仓库整合了 NuGet 的公开仓库和 Nexus 托管的私有仓库。允许用户仅通过一个地址访问到公开和私有的包。

## 参考资料

- [Nexus Repository Manager 官方文档](https://help.sonatype.com/repomanager3/)
