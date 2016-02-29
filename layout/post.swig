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
  <div class="post markdown-body">
    <h1>{{ page.title }}</h1>
    {{ page.content | safe }}
  </div>

  <div class="duoshuo">
    {% include '_partials/duoshuo.swig' %}
  </div>
</div>
{% endblock %}