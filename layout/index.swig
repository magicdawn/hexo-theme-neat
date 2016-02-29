{% extends '_layouts/basic.swig' %}

{% set title = page.title || '首页' %}

{% block css %}
<link rel="stylesheet" href="/build/css/home.css">
{% endblock %}

{% block js %}
<script src='/build/js/home.js'></script>
{% endblock %}

{% block body %}
<div class="container">
  <ul class="posts">
    {% for p in site.posts.sort('date', 'desc') %}
      <li>
        <a href="{{ url_for(p.path) }}">
          {# max 50 char #}
          {{ p.title.slice(0, 50) }}
        </a>
        <div class="time">{{ p.date.format('YYYY-MM-DD HH:mm:ss')  }}</div>
      </li>
    {% endfor %}
  </ul>
</div>
{% endblock %}