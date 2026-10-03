<?php

$id = $_GET["id"] ?? null;

$data = file_get_contents(__DIR__ . "/data/problems.json");
$problems = json_decode($data, true);

if($problems === null) {
  return;
}

//json内に存在しないIDを検知する。
$found = false;

foreach ($problems as $problem) {
  if ($problem["id"] == $id) {
    $found = true;

    $id = $problem["id"];
    $title = $problem["title"];
    $theme = $problem["theme"];
    $uml = $problem["uml"];
  }
}

//存在しないID番号をブラウザで直に入力した場合この処理が実行される。
if(!$found) {
    http_response_code(404);
    echo "Page not found.";
    exit;
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Practice Problem</title>

    <link rel="stylesheet" href="style.css">

    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js"></script>
</head>

<body>

    <main>
        <!-- 問題タイトル -->
        <h1 id="problemTitle">
              ID:<?= $id ?> <?= $title ?>
        </h1>

        <div class="problem-area">

            <!-- 左：ユーザーがPlantUMLを書く -->
            <section class="problem-editor">
                <h2>Your Code</h2>

                <div id="problemEditor"></div>
            </section>

            <!-- 中央：ユーザーが作成した図 -->
            <section class="problem-preview">
                <h2>Your UML</h2>

                <div id="problemPreview">
                    <!-- ユーザーのSVGをここに表示 -->
                </div>
            </section>

            <!-- 右：正解 -->
            <section class="problem-answer">
                <h2>Answer</h2>

                <div id="answerContent">
                    <div class="answer-buttons">
                        <button type="button" id="answerUmlButton">Answer UML</button>
                        <button type="button" id="answerCodeButton">Answer Code</button>
                    </div>
                    <div id = answerDisplay>
                        <!-- 正解のSVGまたはPlantUMLコード -->
                    </div>
                </div>

            </section>

        </div>

        <!-- 戻る -->
        <div class="back-area">
            <a href="problems.php">Back</a>
        </div>

    </main>

    <script> const answerUml = <?= json_encode($uml) ?>; </script>
    <script src="problem.js"></script>

</body>

</html>