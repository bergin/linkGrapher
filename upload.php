
<?php
error_reporting(E_ALL);

 // https://makitweb.com/how-to-upload-file-with-javascript-and-php/
 if(isset($_FILES['file']['name'])){
    // file name
    $filename = $_FILES['file']['name'];
    $data = $_FILES['file']['tmp_name'];
 
    // Location
    $location = 'dump/'.$filename;
    //$dir =     "../wp-content/uploads/wp_dndcf7_uploads/wpcf7-files/";
    //$location = $dir.$filename;

 
    // file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);
    if( $file_extension == "txt")
    {

      // Open the file to get existing content
      $current = file_get_contents($data);
      // Append a new person to the file
    
      // Write the contents back to the file
      file_put_contents($data, $current); 
    }
 

 
    // Valid extensions
    $valid_ext = array("txt","pdf","doc","docx","jpg","png","jpeg");
 
    $response = 0;
    if(in_array($file_extension, $valid_ext))
    {
       // Upload file
       if(move_uploaded_file($data, $location))
       {
          $response = 1;
       } 
    }
  

    echo $response;
    exit;
}

?>