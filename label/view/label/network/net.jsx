import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
var API = module.exports = {
    serverRequest:function(method){
        $.get('./json/demo1.json', function (result) {
              // 将获取到的数据转化为对象的形式
              var arr = JSON.parse(result).dgzq;
              console.log(arr);
              method(arr);
        });
    },
}

