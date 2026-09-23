(function () {
  var cfg = window.SITE_CONFIG || {};

  // 年份
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // 电话号码填充
  var telMap = { sales: cfg.phoneSales, service: cfg.phoneService };
  document.querySelectorAll('[data-tel-text]').forEach(function (el) {
    var key = el.getAttribute('data-tel-text');
    el.textContent = telMap[key] || '';
  });

  // 点击拨号
  document.querySelectorAll('[data-tel]').forEach(function (el) {
    el.addEventListener('click', function () {
      var phone = telMap[el.getAttribute('data-tel')];
      if (phone) window.location.href = 'tel:' + phone;
    });
  });

  // 图片放大
  var box = document.getElementById('lightbox');
  var boxImg = box ? box.querySelector('img') : null;
  document.querySelectorAll('.gallery figure img, .split img, .about img').forEach(function (img) {
    img.addEventListener('click', function () {
      if (!box || !boxImg) return;
      boxImg.src = img.src;
      box.classList.add('on');
    });
  });
  if (box) {
    box.addEventListener('click', function () {
      box.classList.remove('on');
    });
  }

  // 表单提交 → 企业微信群机器人
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
      '时间：' + new Date().toLocaleString('zh-CN'),
    ].join('\n');

    var btn = form.querySelector('button[type=submit]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '提交中…';
    }

    function done(ok) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '提交';
      }
      if (ok) {
        form.reset();
        alert('已收到，我们会尽快联系你。着急的话可以直接打电话。');
      } else {
        alert('提交没成功。可以直接打电话给我们，最快。');
      }
    }

    if (!cfg.leadWebhook) return done(true);

    fetch(cfg.leadWebhook, {
      method: 'POST',
      // 用 text/plain 避免跨域预检，请求发得出去；响应读不到也没关系
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ msgtype: 'text', text: { content: content } }),
    })
      .then(function () {
        done(true);
      })
      .catch(function () {
        // 跨域时这里会报错，但消息通常已经发出去了，按成功处理
        done(true);
      });
  });
})();
