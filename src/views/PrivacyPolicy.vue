<template>
  <div id="privacy-policy">
    <header-nav/>
    <article>
      <h1 class="title is-2 has-text-centered">個人情報の利用目的</h1>
      <section>
        Cullet（以下「本サービス」と称します）では、メールでのお問い合わせ、メールマガジンへの登録などの際に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
      </section>
      <section>
        <h2 class="title is-2">個人情報の第三者への開示</h2>
        <div>本サービスでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</div>
        <ul>
          <li>・本人のご了解がある場合</li>
          <li>・法令等への協力のため、開示が必要となる場合</li>
        </ul>
        <div>ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させていただいた上、速やかに対応させていただきます。</div>
      </section>
      <section>
        <h2 class="title is-2">アクセス解析ツールについて</h2>
        <div>本サービスでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。</div>
        <div>このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくはここをクリックしてください。</div>
      </section>
      <section>
        <h2 class="title is-2">広告の配信について</h2>
        <div>当サービスは第三者配信の広告サービス「Google Adsense グーグルアドセンス」を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は「広告 – ポリシーと規約 – Google」をご覧ください。</div>
        <div>また、Culletは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookie（クッキー）を設定したりこれを認識したりする場合があります。</div>
      </section>
      <section>
        <h2 class="title is-2">免責事項</h2>
        <div>本サービスからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</div>
        <div>本サービスのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。</div>
        <div>本サービスに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</div>
      </section>
      <section>
        <h2 class="title is-2">プライバシーポリシーの変更について</h2>
        <div>本サービスは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。</div>
      </section>
      <section>２０１８年６月１日　制定</section>
    </article>
    <footer-nav class="is-hidden-tablet"/>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'
  import FooterNav from '@/components/FooterNav'

  export default {
    components: {HeaderNav, FooterNav}
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #privacy-policy {
    height: 100vh;
    background-color: white;
    padding-top: $header-nav-height;

    article {
      width: $width;
      max-width: 100%;
      margin: auto;
      padding: 1rem 3rem 6rem;

      section {
        &:not(:last-child) {
          margin-bottom: 2rem;
        }
        ul > li > ul {
          padding-left: 2rem;
        }
      }
    }

    @media screen and (max-width: 768px) {
      padding-bottom: $footer-nav-height;
    }
  }
</style>
