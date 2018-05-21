---
layout: post
title:  "Vim 插件：Buffer Hint"
date:   2015-12-05 18:58:00
tags:   [vim]
---

# The Panic
在 Vim 里查看和切换缓冲区（buffer）可能是件麻烦事。以往在 Eclipse、QtCreator、Visual Studio 这些集成开发环境里，只要鼠标一点就能切换到任一文件。如此常用的操作，在 Vim 之中反而有些痛苦：

- `:ls`
- `:b <tab>`
- `:b <number>`
- `:bn`、`:bp`

或许你会说标签页（tab），标签页是挺直观，但文件一多又不好用了。至此，可能一部分人已经动摇了：倘若这个问题都解决不好，Vim 是没法用的。

# Thinking From Scratch
为了解决上述问题，我们不妨先把需求理一下：

1. 查看所有打开的文件
1. 快速切换到某个文件
1. 支持查找
1. 击键次数尽可能少

对于第一点需求，最直观的方式是像 IDE 那样，用树形控件来显示。但由于 Vim 没有树形控件，我们不妨新建一个缓冲区，把文件名一项项竖着列出来，这样会比较容易。对于第二点需求，其实 Vimperator、Vimium、VimFx 之类的浏览器插件已经给我们做了很好的榜样：在每个缓冲区旁边标上字母，用户只要在键盘上敲对应的字母就能切换到相应缓冲区。对于第三点需求，既然我们已经把文件名丢进了缓冲区，那么直接用 Vim 自带的 `/` 就可以查找，几乎不需要任何额外的工作。至于第四点需求，自然不必多说，否则就失去 Vim 的意义了。

# The Buffer Hint

按照上面的设想，大约是13年八月份，我初步实现了这个名为 Buffer Hint 的 Vim 插件。在接下来的两年里，又陆陆续续对其改进，直到觉得可以放出来分享。

## 安装设置

1. 下载插件：[https://www.vim.org/scripts/script.php?script_id=5272](https://www.vim.org/scripts/script.php?script_id=5272)
1. 复制 bufferhint.vim 到 plugin 目录下，或者用 pathogen 或 vundle
1. 在 `~/.vimrc` 末尾加入以下设置：

{% highlight vim %}
nnoremap - :call bufferhint#Popup()<CR>
nnoremap \ :call bufferhint#LoadPrevious()<CR>
{% endhighlight %}

## 用法简介
- 按 `-` 键，调出「缓冲区列表」，其实它是一个窗口。再按一下，可以把它关闭。
- 缓冲区列表里有当前所有缓冲区的名字，最左侧有一个或两个字母（hint key）与之关联。
- 按下字母，就能切换到对应的缓冲区！有没有一点 Vimperator/Vimium/VimFx 的感觉？
- 按 `\` 键，切回上一个缓冲区。当你需要频繁地在某两个文件之间来回切换时，这个键会很好用。
- 当光标在缓冲区列表里面时，按 `q` 可以关闭窗口，`k` 和 `j` 可以上下移动。此外 `<Up>`、`<Down>`、`<PgDn>`、`<PgUp>`、`<C-f>`、`<C-b>`、`<Home>`、`<End>`、`gg`、`G` 也可移动光标。
- 查找只需像往常一样按下 `/`，输入关键字。然后嘛，`n` 跳到下一个，`N` 跳到上一个。当找到需要的缓冲区之后，直接敲回车就能打开。
- 如果想关闭光标下的缓冲区，`dd` 就好。
- 如果想关闭视区内任一缓冲区，输入 `d` 及其对应的 hint key 就好，例如 `da`。
- 当缓冲区列表第一次打开时，它们是按路径排序的（左侧字母为黄色）。按下空格键 `<Space>`，可以把排序方式切换到 Latest Recently Used 模式（左侧字母变成绿色），这样越是常用的文件排得越前，找起来更方便。

## 注意事项
- 如果在 A 文件里进行了某些修改，然后切换到 B 文件，然后又切换回 A 文件，此时无法用 `u` 执行撤销！这是 Vim 的默认行为，不是本插件导致的。解决方法有两种，第一种是在 Vim 配置里面加入 `set hidden`；第二种是设置成 [persistent undo](http://stackoverflow.com/questions/5700389/using-vims-persistent-undo)。

## 效果图
![bufferhint]({{ site.url }}/images/bufferhint.png)

# One More Thing
如果您觉得这个插件好用，可以通过以下方式予以支持哦 >^_^<

- [在 GitHub 上点亮一颗星](https://github.com/bsdelf/bufferhint)
- [在 Vim 官网上给予好评](http://www.vim.org/scripts/script.php?script_id=5272)
- [在知乎上点赞](http://www.zhihu.com/question/19634223/answer/75807105)

