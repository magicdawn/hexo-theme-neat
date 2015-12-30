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
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Brand</a>
      </div>

      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
        <li><a href="#">Link</a></li>
      </ul>
    </div>
  </nav>
  {% block body %}
  {% endblock %}
  
  <script src='/build/js/base.js'></script>
  {% block js %}
  {% endblock %}
</body>
</html>