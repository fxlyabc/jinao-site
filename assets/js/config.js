/**
 * 官网站点配置 —— 改这里就行
 */
window.SITE_CONFIG = {
  brand: '金鏊',
  company: '费县金鏊机械有限公司',

  // 电话（请核对；暂时取自你们的素材命名）
  phoneSales: '13287122918',
  phoneService: '13082668080',

  /**
   * 表单留资推送到企业微信群机器人。
   * 留空则表单只做本地提示（不做提交）。
   * 注意：这个地址写在网页里，谁都能看到。风险是别人往群里发垃圾消息。
   * 如果在意，后续换成自己的后端接口（比如 Vercel 上的函数）再转发一次。
   */
  leadWebhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b474ac5f-1f7d-40e2-b1e2-cd5e686fc33e',
};
