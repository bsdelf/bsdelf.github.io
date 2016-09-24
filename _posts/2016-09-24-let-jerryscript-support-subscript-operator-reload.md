---
layout: post
title:  "让 JerryScript 支持 \"operator[](int)\" 重载"
date:   2016-09-24 13:50:40
tags:   [JavaScript]
---

# 背景
在 C++ 中，当我们想用下标访问对象中的第 _i_ 个元素时，可以重载下标运算符（subscript operator）。但是 JavaScript（ECMAScript 5.1）中并没有类似的机制，如果我们想访问第 _i_ 个元素，必须添加一个名为 `ToString(i)` 的属性；如果想访问元素 _1_ .. _n_ ，就必须添加 _n_ 个属性。显然这种做法存在额外的内存开销，在嵌入式硬件上是不可接受的。

# 思路
为了解决上述问题，一个很自然的想法就是对 ECMA 的 `[[Get]]`[^ecma-get] 和 `[[Put]]`[^ecma-put] 进行扩展：

1. 当属性 `P` 未找到时，令 `I = ToNumber(P)`。
1. 若 `I` 为整数，则查找 `__get_by_index__` / `__put_by_index__` 方法。
1. 若找到，则返回 `__get_by_index__(I)` / `__put_by_index__(I, V)`。

# 实现
JerryScript 引擎的 `[[Get]]` 和 `[[Put]]` 实现位于 "ecma-objects.c"，本文限于篇幅不贴具体代码，大家只要在注释处按照上节的讨论编写即可，留作练习。

[[[GET]]:](https://github.com/Samsung/jerryscript/blob/0ad347b97fd9a591c992718f960acf76fb8508b3/jerry-core/ecma/operations/ecma-objects.c#L496)
{% highlight c %}
ecma_value_t
ecma_op_object_get (ecma_object_t *object_p, /**< the object */
                    ecma_string_t *property_name_p) /**< property name */
{
    ......
    do {
        ......
    }
    while (object_p != NULL);

    {
        // Implement our [[GET]] extension right here.
    }

    ......
}
{% endhighlight %}

[[[PUT]]:](https://github.com/Samsung/jerryscript/blob/0ad347b97fd9a591c992718f960acf76fb8508b3/jerry-core/ecma/operations/ecma-objects.c#L556)
{% highlight c %}
ecma_value_t
ecma_op_object_put (ecma_object_t *object_p, /**< the object */
                    ecma_string_t *property_name_p, /**< property name */
                    ecma_value_t value, /**< ecma value */
                    bool is_throw) /**< flag that controls failure handling */
{
    ......
    ecma_property_t *property_p = ecma_find_named_property (object_p, property_name_p);
    ......
    if (property_p == NULL)))
    {
        {
           // Implement our [[PUT]] extension right here.
        }

        if (type == ECMA_OBJECT_TYPE_STRING)
        {
            ......
        }
        ......
    }
    ......
}
{% endhighlight %}

# 测试 

将 JerryScript 重新编译后，我们可以使用以下代码进行验证：
{% highlight javascript %}
function Box() {
}

Box.prototype.__get_by_index__ = function (i) {
    print('get:', i);
    return i;
};

Box.prototype.__put_by_index__ = function (i, value) {
    print('put:', i, value);
    return value;
};

var box = new Box();

for (var i = 0; i < 10; ++i) {
    assert(box[i] === i);
}

for (var i = 0; i < 10; ++i) {
    assert((box[i] = i) === i);
}

{% endhighlight %}

大功告成～

[^ecma-get]: [http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.3](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.3)
[^ecma-put]: [http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.5](http://www.ecma-international.org/ecma-262/5.1/#sec-8.12.5)
