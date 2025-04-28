■Filterly(SESフィルターアプリ)


♦デプロイ先:
https://wantedlysesfilter.netlify.app/


♦デスクトップイメージ

カード形式：
<p align="center">
  <img src="https://github.com/user-attachments/assets/02c7c1f9-1e8f-4523-8f7f-2d37b0544bb2" width="600" style="border: 5px solid black"/>
</p>

リスト形式：
<p align="center">
  <img src="https://github.com/user-attachments/assets/ec5a0b21-4730-4d37-aa78-179cb86b8183" width="600" style="border: 5px solid black"/>
</p>

♦スマホイメージ

カード形式：
<p align="center">
  <img src="https://github.com/user-attachments/assets/0e5b7975-cdec-4fad-8ced-0d0b52d712e0" style="border: 5px solid black"/>
</p>

リスト形式：
<p align="center">
  <img src="https://github.com/user-attachments/assets/4964ef2d-7e37-4666-a49e-1cd695e7c37f"　style="border: 5px solid black"/>
</p>


♦概要

このアプリは、Wantedlyから自社・受託企業をスマートに探せるWebツールです


♦機能

・SES以外の求人情報のフィルタリング
・カスタマイズ可能なフィルタ条件
・ユーザーインターフェースはReactとTailwind CSSを使用してレスポンシブ対応
・ユーザーにわかりやすいインタラクション


♦開発の経緯

1. 初期開発（MongoDBローカル）
最初はローカル環境でMongoDBを使用して開発を行いました。データベースのセットアップやクエリのテストが簡単に行え、素早く動作確認ができるため、この方法を選択しました。

2. MongoDB Atlasの導入
次に、クラウドで管理できるMongoDB Atlasに移行しました。クラウド環境でのデータ管理やスケーラビリティが向上しましたが、コストが予算に影響を与える可能性があることがわかり、さらに低コストで運用できる方法を検討しました。

3. JSONファイルによるデータ管理と定期バッチ処理
最終的に、データベースを使用せず、JSONファイルでデータを管理する方法に変更しました。データは定期的なバッチ処理で外部ソース(Wantedly)から取得し、JSONファイルに上書き保存されます。フロントエンドでは、fetch APIを使用してこのJSONファイルからデータを取得し、表示しています。この方法により、サーバレスで簡単にデータ管理ができ、運用コストを削減できました。


♦使用技術

フロントエンド: React, Tailwind CSS
バックエンド： Node.js(puppeteer)

データ管理: JSONファイル（定期バッチ処理で更新）

CI/CD: GitHub Actions, Netlify


♦インストール方法

・このリポジトリをクローンします。
git clone https://github.com/1379SamD/wantedly-ses-filter.git

・必要な依存関係をインストールします。
cd wantedly-ses-filter
npm install

・開発サーバーを起動します。
npm run dev
