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
  <header class="blog-name">
    Land of Ranger
  </header>

  <p>Posts: </p>
  <ul class="posts">
    {% for p in site.posts %}
      <li>
        <a href="{{ url_for(p.path) }}">
          {{ p.title }}
        </a>
        <div class="time">{{ p.date.format('YYYY-MM-DD HH:mm:ss')  }}</div>
      </li>
    {% endfor %}
  </ul>
</div>
{% endblock %}