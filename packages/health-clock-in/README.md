# @gzhu-automation/health-clock-in

> 广州大学自动健康打卡

核心实现是使用`Google`的`Puppeteer`库完成，配合`Github Actions`能够每天自动完成打卡

# Usage

## 1. 通过 Github Actions 自动运行

1. `Fork`本项目(顺便点个 Star 呗~)
2. 点击项目的`Settings`选项，进入`Secrets`的`Actions`面板
3. 点击`New repository secret`
4. `Name`填写`GZHU_USERNAME`，`Secret`则为你的学号，填写完毕后点击`Add secret`完成保存
5. 同理，再添加一个键为`GZHU_PASSWORD`，值为你的数字广大密码的`Secret`即可

> PS: 不用担心学号密码泄露问题，因为数据都是由`github`管理，当然，如果你不放心的话可以不用

完成上述配置后就大功告成啦，每天早上`9:00`会准时自动打卡

如果需要更改打卡时间的话可以修改`.github/workflows/clock-in-every-day.yml`中的`on.schedule.cron`的值，按照`crontab`的语法配置运行时间

如果遇到数字广大登录不进去的问题的话则说明是`github`无法访问广大的网络，这个时候就需要换一种方式去运行了

## 2. 通过服务器运行

本项目已发布到`npm`上，可以在你的服务器中安装`@gzhu-automation/health-clock-in`这个包来运行，配置好环境变量后直接导入该包中的`run`函数执行即可，配合服务器上设置定时任务即可实现每日自动打卡

可以安装`dotenv`，然后在`.env`文件中声明好环境变量后通过如下方式运行

```shell
node -r dotenv/config example/run.js
```

# Environment Variables

通过环境变量的方式配置项目的运行，前面说到的`github actions`中的`secrets`其实最终也会作为环境变量注入到项目中

目前主要有以下几个环境变量可配置:

## 数字广大相关

- `GZHU_USERNAME`: 数字广大用户名
- `GZHU_PASSWORD`: 数字广大密码

## 邮箱日志服务相关

配置好后可以开启邮箱日志功能，在运行过程中遇到错误或者成功打卡后都会通知到配置的邮件中

- `EMAIL_HOST`: 邮箱服务的域名，如`qq`邮箱使用`smtp`的方式的话则配置为`smtp.qq.com`
- `EMAIL_USER`: 邮箱用户名，如`xxx@qq.com`
- `EMAIL_PASS`: 邮箱授权码，可自行登录邮箱获取
