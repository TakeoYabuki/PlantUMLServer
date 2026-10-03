<?php

$data = file_get_contents(__DIR__ . '/data/problems.json');
$problems = json_decode($data, true);

if ($problems === null) {
    return;
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practice Problems</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

  <header>
      <h1>Practice Problems</h1>

      <nav>
          <a href="index.php">Editor</a>
          <a href="problems.php">Practice</a>
      </nav>
  </header>

  <main>
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Theme</th>
              </tr>
          </thead>

          <tbody>
              <?php foreach ($problems as $problem): ?>
                  <tr>
                      <td>
                        <a href = "problem.php?id=<?= $problem["id"] ?>">
                        <?= $problem["id"] ?> </a>
                      </td>
                      <td><?= $problem["title"] ?></td>
                      <td><?= $problem["theme"] ?></td>
                  </tr>
              <?php endforeach; ?>

          </tbody>
      </table>
  </main>

</body>
</html>