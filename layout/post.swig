{% extends '_layouts/basic.swig' %}

{% set title = page.title %}

{% block css %}
<link rel="stylesheet" href="/build/css/post.css">
{% endblock %}

{% block js %}
<script src='/build/js/post.js'></script>
{% endblock %}

{% block body %}
<div class="container">
  <div class="post">
    page.content 出不来...
    {{ page.content | safe }}
  </div>
</div>
{% endblock %}