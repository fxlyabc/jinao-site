(function () {
  var cfg = window.SITE_CONFIG || {};
  var telMap = { sales: cfg.phoneSales, service: cfg.phoneService };

  // 年份
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // 电话文案
  document.querySelectorAll('[data-tel-text]').forEach(function (el) {
    el.textContent = telMap[el.getAttribute('data-tel-text')] || '';
  });

  // 点击拨号
  document.querySelectorAll('[data-tel]').forEach(function (el) {
    el.addEventListener('click', function () {
      var phone = telMap[el.getAttribute('data-tel')];
      if (phone) window.location.href = 'tel:' + phone;
    });
  });

  // 图片放大（点任意带有 data-zoom 的图片）
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<img alt="" />';
  document.body.appendChild(box);
  var boxImg = box.querySelector('img');
  box.addEventListener('click', function () {
    box.classList.remove('on');
  });
  document.querySelectorAll('.field img, .product img').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      boxImg.src = img.src;
      box.classList.add('on');
    });
  });

  // 留资表单 → 企业微信群机器人
  var form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    var phone = (data.get('phone') || '').toString().trim();
    var area = (data.get('area') || '').toString().trim();
    var remark = (data.get('remark') || '').toString().trim();

    if (!name) return alert('请填写称呼');
    if (!/^1\d{10}$/.test(phone)) return alert('请填写正确的手机号');

    var content = [
      '【官网留资】金鏊全自动煎饼机',
      '称呼：' + name,
      '电话：' + phone,
      '地区：' + (area || '未填'),
      '需求：' + (remark || '未填'),
      '来自：' + location.pathname,
      '时间：' + new Date().toLocaleString('zh-CN'),
    ].join('\n');

    var btn = form.querySelector('button[type=submit]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '提交中…';
    }

    function done() {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '提交';
      }
      form.reset();
      alert('已收到，我们会尽快联系你。着急的话可以直接打电话。');
    }

    if (!cfg.leadWebhook) return done();

    fetch(cfg.leadWebhook, {
      method: 'POST',
      // 用 text/plain 避免跨域预检，请求发得出去；响应读不到也不影响
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ msgtype: 'text', text: { content: content } }),
    })
      .then(done)
      .catch(done);
  });
})();
