require.config({paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"}});

require(["vs/editor/editor.main"], function () {
    const problemEditor = monaco.editor.create(document.getElementById("problemEditor"), {
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
    const updatePreview = (currentValue) => {

      const formData = new FormData();
      formData.append("uml", currentValue);
      formData.append("format", "svg");

      fetch("generate.php", {
        method: "POST",
        body: formData
      })
      .then(function(response) {
        if(!response.ok) {
            throw new Error("failed to generate diagram.");
        }
        return response.text();
      })
      .then(function(text) {
        const preview = document.getElementById("problemPreview")
        preview.innerHTML = text;
      })
      .catch(function(error) {
        console.log(error);
      });
    };

    //入力をやめるまで関数を遅らせる。
    function debounce (process, time) {
      let timerId;

      return function(currentValue) {
        //カウントの初期化。
        clearTimeout(timerId);
        //カウント開始。
        timerId = setTimeout(function() {
          process(currentValue);
        }, time);
      };
    }

    const debouncedUpdate = debounce(updatePreview, 500);

    //プレビュー更新を検知。
    problemEditor.onDidChangeModelContent(function () {
      const currentValue = problemEditor.getValue();
    //エディタの内容が変更されるたびに、空ならプレビューを消して終了。空でなければプレビュー更新処理へ進む。
      if (currentValue.trim() === "") {
        const preview = document.getElementById("problemPreview")
        preview.innerHTML = "";
        return;
      }
      debouncedUpdate(currentValue);
    })


    //解答表示の分岐処理。
    function showAnswerPreview(formatData) {
      const preview = document.getElementById("answerDisplay");

      if(formatData === "uml") {
        const umlText = answerUml;

        const formData = new FormData();
        formData.append("uml", umlText);
        formData.append("format", "svg");

        fetch("generate.php", {
          method: "POST",
          body: formData
        })
        .then(function(response) {
          if(!response.ok){
            throw new Error("Failed to generate diagram.");
          }
          return response.text();
        })
        .then(function(text) {
          preview.innerHTML = text;
        })
        .catch(function(error) {
          console.log(error);
        });
      } else {
          preview.textContent = answerUml;
      }

    }

    //Answer UML 表示。
    const umlButton = document.getElementById("answerUmlButton");

    umlButton.addEventListener("click", function(event) {

      event.preventDefault();
      showAnswerPreview("uml");
    });

    //Answer Code 表示。
    const codeButton = document.getElementById("answerCodeButton");

    codeButton.addEventListener("click", function(event) {

      event.preventDefault();
      showAnswerPreview("code");
    });
});