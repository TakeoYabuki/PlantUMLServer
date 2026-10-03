require.config({paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"}});

require(["vs/editor/editor.main"], function () {
    const editor = monaco.editor.create(document.getElementById("editor"), {
value: `@startuml
Alice -> Bob : Hello
Bob --> Alice : Hi
@enduml`,
    language: "plaintext",
    theme: "vs-light",
    automaticLayout: true,

    minimap: {
            enabled: false
        }
    });

    //デバウンス後にプレビューを更新する。
    const updatePreview = () => {
      showTextPreview("svg");
    }
    //入力をやめるまで関数を遅らせる。
    function debounce (process, time) {
      let timerId;

      return function() {
        //カウントの初期化。
        clearTimeout(timerId);
        //カウント開始。
        timerId = setTimeout(function() {
          process();
        }, time);
      };
    }

    const debouncedUpdate = debounce(updatePreview, 500);

    //プレビュー更新を検知。
    editor.onDidChangeModelContent(function () {
      const currentValue = editor.getValue();

      if (currentValue.trim() === "") {
        const preview = document.getElementById("preview");
        preview.innerHTML = "";
        return;
    }
      debouncedUpdate();
    });

    //png形式処理。
    const pngButton = document.getElementById("pngButton");

    pngButton.addEventListener("click", function(event) {

      event.preventDefault();

      const umlText = editor.getValue();

      const formData = new FormData();
      formData.append("uml", umlText);
      formData.append("format", "png");

      fetch("generate.php",{
        method: "POST",
        body: formData
      })
      .then(function(response) {
        if(!response.ok) {
          throw new Error("Failed to generate diagram.");
        }
        return response.blob();
      })
      .then(function(blob) {
        const imageUrl = URL.createObjectURL(blob);
        const img = document.createElement("img");
        img.src = imageUrl;
        
        img.onload = function() {
          URL.revokeObjectURL(imageUrl);
        };

        const preview = document.getElementById("preview");
        preview.innerHTML = "";
        preview.appendChild(img);
      })
      .catch(function(error) {
        console.log(error);
      });
    });


    //svg,txt 共通処理。
    function showTextPreview(format) {
      const umlText = editor.getValue();

      const formData = new FormData();
      formData.append("uml", umlText);
      formData.append("format", format);

      fetch("generate.php", {
        method: "POST",
        body: formData
      })
      .then(function (response) {
        if(!response.ok) {
          throw new Error("failed to generate diagram.");
        }
        return response.text();
      })
      .then(function (text) {
        const preview = document.getElementById("preview");

        if(format === "svg") {
            preview.innerHTML = text;
        } else {
            preview.textContent = text;
        }
    })
      .catch(function(error) {
        console.log(error);
      });
    }
    //svg形式処理。
    const svgButton = document.getElementById("svgButton");

    svgButton.addEventListener("click", function(event) {

      event.preventDefault();
      showTextPreview("svg");
    });

    //txt形式処理。
    const txtButton = document.getElementById("txtButton");

    txtButton.addEventListener("click", function(event) {

      event.preventDefault();
      showTextPreview("txt");
    })


    //ダウンロード共通処理。
    function createDownloadFile(format) {

      const umlText = editor.getValue();

      const formData = new FormData();
      formData.append("uml", umlText);
      formData.append("format", format);

      fetch("generate.php",{
        method: "POST",
        body: formData
      })
      .then(function(response) {
        if(!response.ok) {
            throw new Error("Download failed.");
        } else {
            return response.blob();
        }
      })
      .then(function(blob) {
        const fileUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `diagram.${format}`;
        a.click();

        URL.revokeObjectURL(fileUrl);
      })
      .catch(function(error) {
        console.log(error);
      })
    }

    //PNGダウンロード処理。
    const downloadPng = document.getElementById("downloadPng");

    downloadPng.addEventListener("click", function(event) {

      event.preventDefault();

      createDownloadFile("png")
    })

    //SVGダウンロード処理。
    const downloadSvg = document.getElementById("downloadSvg");

    downloadSvg.addEventListener("click", function(event) {

      event.preventDefault();

      createDownloadFile("svg")
    })
    
    //Txtダウンロード処理。
    const downloadTxt = document.getElementById("downloadTxt");

    downloadTxt.addEventListener("click", function(event) {

      event.preventDefault();

      createDownloadFile("txt")
    })

    //チートシートの処理。各図の種類に対応するPlantUMLのサンプルコード
    const cheatSheets = {
    sequence: `@startuml
Alice -> Bob : Hello
Bob --> Alice : Hi
@enduml`,

    class: `@startuml
class User {
    +name: String
    +login()
}
@enduml`,

    usecase: `@startuml
actor User
User --> (Login)
@enduml`,

    activity: `@startuml
start
:Login;
:View Dashboard;
stop
@enduml`,

    state: `@startuml
[*] --> Idle
Idle --> Running
Running --> [*]
@enduml`,

    component: `@startuml
component Browser
component Server

Browser --> Server
@enduml`
};


    //各ボタンの処理。
    const cheatSheetButtons = document.querySelectorAll("[data-diagram]");

    cheatSheetButtons.forEach(function(button) {

      button.addEventListener("click", function() {
        //押下されたボタンとそれに該当するサンプルコードを上記cheatSheetsより取得する。
        const diagramType = button.dataset.diagram;
        const umlText = cheatSheets[diagramType];

        const formData = new FormData();
        formData.append("uml", umlText);
        formData.append("format", "svg");

        fetch("generate.php", {
            method: "POST",
            body: formData
        })
        .then(function(response) {
            if(!response.ok) {
                throw new Error("Failed to generate diagram.");
            }
            return response.text();
        })
        .then(function(svg) {
            const cheatSheetContent = document.getElementById("cheatSheetContent");
            cheatSheetContent.innerHTML = "";
            const code = document.createElement("pre");
            code.textContent = umlText;
            const diagram = document.createElement("div");
            diagram.innerHTML = svg;
            cheatSheetContent.appendChild(code);
            cheatSheetContent.appendChild(diagram);
        })
        .catch(function(error) {
            console.log(error);
        });
      });
    });
});



