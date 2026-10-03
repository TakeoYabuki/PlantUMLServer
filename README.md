# PlantUML Server

PlantUML Serverを利用して、PlantUMLコードからソフトウェア設計図を生成するWebアプリケーションです。

Monaco EditorでPlantUMLコードを編集し、リアルタイムで図をプレビューできます。
また、生成した図をPNG、SVG、ASCII形式で表示・ダウンロードできます。

## 機能

### PlantUML Editor

Monaco Editorを使用してPlantUMLコードを入力できます。

入力内容の変更を検知し、一定時間入力がない場合に自動的にプレビューを更新します。
デバウンス処理を利用することで、PlantUML Serverへの不要なリクエストを抑えています。

### プレビュー

以下の形式で図を表示できます。

- PNG
- SVG
- ASCII

SVG形式を使用したリアルタイムプレビューにも対応しています。

### ダウンロード

生成した図を以下の形式でダウンロードできます。

- `.png`
- `.svg`
- `.txt`

### PlantUMLチートシート

代表的なPlantUMLの記法を、サンプルコードと生成された図を並べて確認できます。

現在、以下の図に対応しています。

- Sequence Diagram
- Class Diagram
- Use Case Diagram
- Activity Diagram
- State Diagram
- Component Diagram

### 練習問題

PlantUMLの記述を練習するための問題機能です。

問題一覧から課題を選択すると、

- PlantUMLコードの入力
- 自分が作成した図のリアルタイムプレビュー
- 正解例のUML
- 正解例のPlantUMLコード

を確認できます。

問題データは `data/problems.json` で管理しているため、新しい問題を追加しやすい構成になっています。

## 使用技術

- PHP
- JavaScript
- HTML
- CSS
- Monaco Editor
- PlantUML Server
- Composer
- `jawira/plantuml-encoding`

## ファイル構成

```text
PlantUMLServer/
├── index.php
├── generate.php
├── script.js
├── style.css
├── problems.php
├── problem.php
├── problem.js
├── data/
│   └── problems.json
├── composer.json
├── composer.lock
└── README.md
```

`vendor/` はComposerによって生成されるため、Gitリポジトリには含めません。

## 使い方

PlantUMLコードはブラウザから `generate.php` にPOSTされます。

```text
Browser / Monaco Editor
        ↓
PlantUML Code
        ↓
JavaScript fetch()
        ↓
generate.php
        ↓
jawira/plantuml-encoding
        ↓
PlantUML Server
        ↓
SVG / PNG / ASCII
        ↓
Browser
```

`jawira/plantuml-encoding` を使用してPlantUMLコードをエンコードし、PlantUML Serverへリクエストを送信します。

取得したPNG、SVG、ASCIIデータはPHPからブラウザへ直接返されます。

## ストレージ

生成された図をローカルサーバー上のファイルとして保存しない設計になっています。

PlantUML Serverから取得したデータはPHPの変数に保持し、そのままHTTPレスポンスとしてブラウザへ返します。

そのため、生成した画像ファイルをサーバーストレージに蓄積せず、ストレージを効率的に使用できます。

ブラウザ側でPNGを扱う際に生成したObject URLについても、使用後に `URL.revokeObjectURL()` で解放しています。

## バリーションとエラーハンドリング

以下の入力・エラー処理を実装しています。

- 空のPlantUMLコードを拒否
- `svg`、`png`、`txt` 以外のフォーマットを拒否
- PlantUML Serverからデータを取得できなかった場合のエラー処理
- 存在しないPractice Problem IDへの404レスポンス
- Editorが空の場合は不要なPreviewリクエストを送信しない
- JavaScript側でHTTPレスポンスの成功・失敗を確認

## セットアップ

Composerの依存パッケージをインストールします。

```bash
composer install
```

PHPの開発サーバーを起動します。

```bash
php -S localhost:8000
```

ブラウザから以下にアクセスします。

```text
http://localhost:8000
```

## 拡張性

図の生成処理は共通の `generate.php` を使用しているため、PlantUMLが対応している新しい図の種類を追加する場合でも、基本的な生成処理を変更する必要はありません。

Cheat SheetやPractice Problemについても、サンプルデータや `problems.json` を追加することで拡張できる構成にしています。

## プロダクション

本アプリケーションは本番サーバーへのデプロイを想定しています。

本番環境ではNGINX、PHP-FPM、HTTPSを使用して公開します。