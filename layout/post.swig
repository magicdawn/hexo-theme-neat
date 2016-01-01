{% extends '_layouts/basic.swig' %}

{% set title = page.title %}

{% block css %}
<link rel="stylesheet" href="/build/css/post.css">
{# <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/styles/default.min.css"> #}
{% endblock %}

{% block js %}
<script src='/build/js/post.js'></script>
{% endblock %}

{% block body %}
<div class="container">
  <div class="post">
    {{ page.content | safe }}
  </div>
</div>
{% endblock %}