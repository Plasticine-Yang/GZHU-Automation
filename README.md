# 广州大学自动健康打卡

核心实现是使用`Google`的`Puppeteer`库完成，配合`Github Actions`能够每天自动完成打卡

# Usage

1. `Fork`本项目(顺便点个 Star 呗~)
2. 点击项目的`Settings`选项，进入`Secrets`的`Actions`面板
3. 点击`New repository secret`
4. `Name`填写`GZHU_USERNAME`，`Secret`则为你的学号，填写完毕后点击`Add secret`完成保存
5. 同理，再添加一个键为`GZHU_PASSWORD`，值为你的数字广大密码的`Secret`即可

> PS: 不用担心学号密码泄露问题，因为数据都是由`github`管理，当然，如果你不放心的话可以不用

完成上述配置后就大功告成啦，每天早上`9:00`会准时自动打卡

如果需要更改打卡时间的话可以修改`.github/workflows/clock-in-every-day.yml`中的`on.schedule.cron`的值，按照`crontab`的语法配置运行时间
