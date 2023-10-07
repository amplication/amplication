<?php
$targetDirectory = "uploads/";
$targetFile = $targetDirectory . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;

// Check if the file already exists
if (file_exists($targetFile)) {
    echo "Sorry, this file already exists.";
    $uploadOk = 0;
}

// Check file size (you can set a limit here)
if ($_FILES["fileToUpload"]["size"] > 5000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow only specific file types (e.g., jpg, png)
$allowedFileTypes = array("jpg", "png", "jpeg", "gif");
$fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
if (!in_array($fileType, $allowedFileTypes)) {
    echo "Sorry, only JPG, JPEG, PNG, and GIF files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
} else {
    // Move the file to the target directory
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
        echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
