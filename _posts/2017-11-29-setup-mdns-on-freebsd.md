---
layout: post
title:  "在 FreeBSD 上部署 mDNS 服务"
date:   2017-11-29 21:29:00
tags:   [FreeBSD]
---

# 背景

通常局域网中没有专门的域名解析服务器，主机之间通信只能使用 IP 地址。然而 IP 可能会随着设备接入先后顺序发生变化，用起来不太方便。为了解决这个问题，我们可以在局域网内的每台主机上部署 mDNS 服务，然后通过 ".local" 域名实现主机之间的相互通信。[^mdns]

# 安装和配置

首先确保主机名以 ".local" 结尾，这个可以通过 `hostname` 命令查看。如果不是的话，需要修改 `rc.conf`，例如我的工作站是这样配置的：
{% highlight sh %}
hostname="Z240.local"
{% endhighlight %}

然后安装 mDNS 服务，比较主流的大概是 Avahi 和 mDNSResponder，前者是 Lennart Poettering 开发的，后者是苹果公司开源的。由于我不喜欢 Lennart 还有他搞的 systemd，自然选用后者：
{% highlight sh %}
cd /usr/ports/net/mDNSResponder
make install clean
echo 'mdnsd_enable="YES"' >> /etc/rc.conf
service mdns start
{% endhighlight %}

上述操作完成后，我们可以找一台 macOS 机器测试一下能否解析成功：
{% highlight sh %}
ping Z240.local
{% endhighlight %}

不出意外的话，macOS 机器应该能够发现 FreeBSD 机器了。此时，虽然 mDNS 服务会在局域网中应答问询，收集其他主机的域名和 IP 地址，但是操作系统却不知道它的存在，所以依旧无法解析 ".local"。为此，我们还需要安装 nss [^nss] 插件：
{% highlight sh %}
cd /usr/ports/dns/mDNSResponder_nss
make install clean
{% endhighlight %}

并且修改 "/etc/nsswitch.conf"[^nss-config]，把 "hosts" 开头的那行改为如下：
{% highlight plain %}
hosts: files mdns dns
{% endhighlight %}

然后重启系统服务：
{% highlight sh %}
service nsswitch restart
{% endhighlight %}

这样 FreeBSD 在遇到不认识的域名时，会先查询 "/etc/hosts"，然后询问 mDNS，最后才会走常规的 DNS。因此，如果局域网中存在名为 "MyMacBook.local" 的主机，第二步就会解析成功。

至此 FreeBSD 上的 mDNS 服务算是部署完成了。

[^mdns]: [Multicast DNS](https://en.wikipedia.org/wiki/Multicast_DNS)
[^nss]: [Name Service Switch](https://en.wikipedia.org/wiki/Name_Service_Switch)
[^nss-config]: [NSSWITCH.CONF(5)](https://www.freebsd.org/cgi/man.cgi?query=nsswitch.conf&sektion=5&n=1)
