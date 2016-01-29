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
  <header>
    <div class="container">
      <ul class="links">
        <li class="active"><a href="/">Home</a></li>
        <li><a href="#">Link</a></li>
      </ul>
    </div>
  </header>
  {% block body %}
  {% endblock %}

  <script src='/build/js/base.js'></script>
  {% block js %}
  {% endblock %}
</body>
</html>