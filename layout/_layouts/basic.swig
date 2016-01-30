<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>

  <link rel="stylesheet" href="/build/css/base.css">
  {% block css %}
  {% endblock %}
</head>
<body>
  <header class="nav">
    <div class="container">
      <ul class="links">
        <li class="{% if !activeKey || activeKey === 'home' %}active{% endif %}"><a href="/">Home</a></li>
        <li class="{% if activeKey === 'about' %}active{% endif %}"><a href="/about">About</a></li>
      </ul>
    </div>
  </header>

  {% block body %}
  {% endblock %}

  <footer>
    <div class="container">
      &copy;2016 <a href="/">Magicdawn</a>
    </div>
  </footer>

  <script src='/build/js/base.js'></script>
  {% block js %}
  {% endblock %}
</body>
</html>