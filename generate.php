<?php

require __DIR__ . '/vendor/autoload.php';
use function Jawira\PlantUml\encodep;

$uml = $_POST["uml"] ?? "";
$format = $_POST["format"] ?? "";

if(trim($uml) === "") {
    http_response_code(400);
    echo "uml is empty.";
    exit;
}

if(!in_array($format, ["svg", "png", "txt"], true)) {
    http_response_code(400);
    echo "Invalid format.";
    exit;
}

//PlantUMLサーバーにUMLテキストを送るための処理。
$encode = encodep($uml);

$url = "https://www.plantuml.com/plantuml/{$format}/{$encode}";

//PlantUMLサーバー側から生成されたファイルを参照して変数$resultに代入している。
$result = file_get_contents($url);

//PlantUML Severとの通信失敗。
if($result === false) {
    http_response_code(502);
    echo "Failed to generate diagram.";
    exit;
}

if($format === "svg" ) {
    header("Content-Type: image/svg+xml");
} elseif($format === "png") {
    header("Content-Type: image/png");
} else {
    header("Content-Type: text/plain; charset=UTF-8");
}

echo $result;