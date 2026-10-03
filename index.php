<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>PlantUML Editor</title>

    <link rel="stylesheet" href="style.css">

    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js"></script>
</head>

<body>

    <header>
        <h1>PlantUML Editor</h1>
        <nav>
            <a href="index.php">Editor</a>
            <a href="problems.php">Practice</a>
        </nav>
    </header>

    <main>

        <div class="editor-area">
            <!-- PlantUML入力 -->
            <section>
                <h2>PlantUML Code</h2>
                <div id="editor"></div>
            </section>
            <!-- UML表示 -->
            <section>
                <h2>Preview</h2>
                <div id="preview"></div>
            </section>

        </div>

        <div class="toolbar">
            <button type="button" id="pngButton">PNG</button>
            <button type="button" id="svgButton">SVG</button>
            <button type="button" id="txtButton">ASCII</button>

            <button type="button" id="downloadPng">Download PNG</button>
            <button type="button" id="downloadSvg">Download SVG</button>
            <button type="button" id="downloadTxt">Download ASCII</button>
        </div>

    <section id="cheatSheet">

        <h2>PlantUML Cheat Sheet</h2>

        <div class="cheat-sheet-menu">
            <button type="button" data-diagram="sequence">Sequence</button>
            <button type="button" data-diagram="class">Class</button>
            <button type="button" data-diagram="usecase">Use Case</button>
            <button type="button" data-diagram="activity">Activity</button>
            <button type="button" data-diagram="state">State</button>
            <button type="button" data-diagram="component">Component</button>
        </div>

        <div id="cheatSheetContent">
            <!-- 選択したチートシートをここに表示 -->
        </div>

    </section>

    </main>

    <script src="script.js"></script>

</body>
</html>